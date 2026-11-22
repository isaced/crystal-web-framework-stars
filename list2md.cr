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

# Auth: GitHub removed query-parameter tokens in 2021, so send the token as
# an Authorization header instead. GITHUB_TOKEN is provided automatically
# by GitHub Actions; without it the requests run unauthenticated, which is
# fine for this list's size.
HEADERS = HTTP::Headers{"User-Agent" => "crystal-web-framework-stars"}
if token = ENV["GITHUB_TOKEN"]?
  HEADERS["Authorization"] = "Bearer #{token}" unless token.empty?
end

# Activity tier from the last commit date:
# active <= 1 year, stale <= 3 years, inactive = no commits for 3+ years.
def activity_status(last_commit_date : String) : String
  days = (Time.utc - Time.parse_rfc3339(last_commit_date)).days
  if days <= 365
    "active"
  elsif days <= 365 * 3
    "stale"
  else
    "inactive"
  end
end

repos = [] of Hash(String, JSON::Any)

# Read framework list from 'list.txt'
File.each_line("list.txt") do |line|
  url = line.strip
  if url.starts_with?("https://github.com/")
    slug = url[19..]

    # repo
    repo = JSON.parse(HTTP::Client.get("https://api.github.com/repos/#{slug}", headers: HEADERS).body).as_h

    # Skip repos the API did not return (renamed/deleted/rate-limited)
    # instead of crashing the whole weekly run on one bad entry.
    next unless repo["stargazers_count"]?

    # commit
    commit = JSON.parse(HTTP::Client.get("https://api.github.com/repos/#{slug}/commits/#{repo["default_branch"]}", headers: HEADERS).body)
    last_commit_date = commit["commit"]["committer"]["date"].as_s
    repo["last_commit_date"] = JSON::Any.new(last_commit_date)
    repo["activity_status"] = JSON::Any.new(activity_status(last_commit_date))

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

repos.sort_by! { |item| -item["stargazers_count"].as_i }

# Generate README.md
readme = Output.new(repos).to_s
File.write("README.md", readme)

# Generate list.json
File.write("list.json", repos.to_json)
