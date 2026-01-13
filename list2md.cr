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

access_token = ENV["github_access_token"] ||= ""
repos = [] of Hash(String, JSON::Any)

# Read framework list from 'list.txt'
File.each_line("list.txt") do |line|
  url = line.strip
  if url.starts_with?("https://github.com/")
    # repo
    repo_api = "https://api.github.com/repos/#{url[19..]}?access_token=#{access_token}"
    repo = JSON.parse(HTTP::Client.get(repo_api).body).as_h

    # commit
    commit_api = "https://api.github.com/repos/#{url[19..]}/commits/#{repo["default_branch"]}?access_token=#{access_token}"
    commit = JSON.parse(HTTP::Client.get(commit_api).body)
    repo["last_commit_date"] = commit["commit"]["committer"]["date"]

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
      "organization",
    ].includes?(k) }

    repos.sort_by! { |item| -item["stargazers_count"].as_i }
  end
end

# Generate README.md
readme = Output.new(repos).to_s
File.write("README.md", readme)

# Generate list.json
File.write("list.json", repos.to_json)
