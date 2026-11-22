require "ecr"
require "http/client"
require "json"

class Output
  property time

  def initialize(@list : Array(Hash(String, JSON::Any)))
    @time = Time.utc
  end

  ECR.def_to_s "README.ecr"
end

API_ROOT = "https://api.github.com"

# Auth: GitHub removed query-parameter tokens in 2021, so send the token as
# an Authorization header instead. GITHUB_TOKEN is provided automatically
# by GitHub Actions; without it the requests run unauthenticated, which is
# fine for this list's size.
HEADERS = HTTP::Headers{"User-Agent" => "crystal-web-framework-stars"}
if token = ENV["GITHUB_TOKEN"]?
  HEADERS["Authorization"] = "Bearer #{token}" unless token.empty?
end

# The repository is gone (renamed or deleted): recoverable, skip it.
class NotFoundError < Exception
end

# The repository has no commit to read a date from: recoverable, skip it.
class EmptyRepositoryError < Exception
end

# Anything else (rate limit, bad credentials, server error) must stop the run
# so a partial result never overwrites the published README.
class ApiError < Exception
end

def api_get(path : String) : JSON::Any
  response = HTTP::Client.get("#{API_ROOT}#{path}", headers: HEADERS)
  case response.status_code
  when 200
    JSON.parse(response.body)
  when 404
    raise NotFoundError.new(path)
  when 409
    raise EmptyRepositoryError.new(path)
  else
    snippet = response.body
    if snippet.size > 160
      snippet = snippet[0, 160]
    end
    raise ApiError.new("GET #{path} -> #{response.status_code}: #{snippet}")
  end
end

def commit_date(commit : JSON::Any) : String?
  payload = commit["commit"]?
  return nil unless payload

  committer = payload["committer"]?
  return nil unless committer

  date = committer["date"]?
  date.try(&.as_s?)
end

# Activity tier from the last commit date:
# active <= 1 year, stale <= 3 years, inactive = no commits for 3+ years.
def activity_status(last_commit_date : String) : String?
  days = (Time.utc - Time.parse_rfc3339(last_commit_date)).days
  if days <= 365
    "active"
  elsif days <= 365 * 3
    "stale"
  else
    "inactive"
  end
rescue Time::Format::Error
  nil
end

repos = [] of Hash(String, JSON::Any)
total = 0
skipped = 0

# Read framework list from 'list.txt'
File.each_line("list.txt") do |line|
  url = line.strip
  if url.starts_with?("https://github.com/")
    total += 1
    slug = url[19..]

    # repo
    repo = begin
      api_get("/repos/#{slug}").as_h
    rescue NotFoundError
      STDERR.puts "skip #{slug}: repository not found"
      skipped += 1
      next
    end

    default_branch = repo["default_branch"]?.try(&.as_s?) || "main"

    # commit
    commit = begin
      api_get("/repos/#{slug}/commits/#{default_branch}")
    rescue NotFoundError
      STDERR.puts "skip #{slug}: no commit for default branch #{default_branch}"
      skipped += 1
      next
    rescue EmptyRepositoryError
      STDERR.puts "skip #{slug}: empty repository"
      skipped += 1
      next
    end

    last_commit_date = commit_date(commit)
    unless last_commit_date
      STDERR.puts "skip #{slug}: commit payload has no readable date"
      skipped += 1
      next
    end

    status = activity_status(last_commit_date)
    unless status
      STDERR.puts "skip #{slug}: unparseable commit date #{last_commit_date.inspect}"
      skipped += 1
      next
    end

    repo["last_commit_date"] = JSON::Any.new(last_commit_date)
    repo["activity_status"] = JSON::Any.new(status)

    # filter keys
    repos << repo.select { |k, v| [
      "name",
      "full_name",
      "html_url",
      "stargazers_count",
      "forks_count",
      "open_issues_count",
      "description",
      "last_commit_date",
      "activity_status",
      "organization",
    ].includes?(k) }
  end
end

if repos.empty?
  STDERR.puts "no repositories collected (#{skipped}/#{total} skipped); refusing to overwrite README.md and list.json"
  exit 1
end

repos.sort_by! { |item| -item["stargazers_count"].as_i }

# Generate README.md
readme = Output.new(repos).to_s
File.write("README.md", readme)

# Generate list.json
File.write("list.json", repos.to_json)

STDERR.puts "updated #{repos.size}/#{total} repositories (#{skipped} skipped)"
