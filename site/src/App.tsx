import "./App.css";

import useSWR from "swr";

const DATA_URL = "https://cdn.jsdelivr.net/gh/isaced/crystal-web-framework-stars/list.json";
const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Repo {
  name: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  description: string;
  last_commit_date: string;
}

function App() {
  const { data, error, isLoading } = useSWR<Repo[]>(DATA_URL, fetcher);
  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  return (
    <>
      <h1 className="text-5xl">Top Crystal Web Frameworks</h1>
      <div className="mt-4">
        A list of popular github projects related to Crystal web framework (ranked by stars automatically) Please update
        list.txt (via Pull Request)
      </div>
      <div className="relative overflow-x-auto mt-10">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Project Name
              </th>
              <th scope="col" className="px-6 py-3">
                Stars
              </th>
              <th scope="col" className="px-6 py-3">
                Forks
              </th>
              <th scope="col" className="px-6 py-3">
                Open Issues
              </th>
              <th scope="col" className="px-6 py-3">
                Description
              </th>
              <th scope="col" className="px-6 py-3">
                Last Commit
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.map((repo) => (
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {repo.name}
                </th>
                <td className="px-6 py-4">{repo.stargazers_count}</td>
                <td className="px-6 py-4">{repo.forks_count}</td>
                <td className="px-6 py-4">{repo.open_issues_count}</td>
                <td className="px-6 py-4">{repo.description}</td>
                <td className="px-6 py-4">{repo.last_commit_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-10 text-slate-400">
        <a
          href="https://github.com/isaced/crystal-web-framework-stars"
          className="flex justify-center items-center space-x-1"
        >
          <img
            src="https://avatars.githubusercontent.com/in/15368?s=48&v=4"
            className="w-4 h-4 rounded-full overflow-hidden"
          />
          <span>isaced/crystal-web-framework-stars</span>
        </a>
      </div>
    </>
  );
}

export default App;
