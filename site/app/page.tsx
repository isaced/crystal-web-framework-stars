import Image from "next/image";

const DATA_URL = "https://raw.githubusercontent.com/isaced/crystal-web-framework-stars/master/list.json";

interface Repo {
  name: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  description: string;
  last_commit_date: string;
}

async function fetchData() {
  return (await fetch(DATA_URL)).json() as Promise<Repo[]>;
}

export default async function Home() {
  const data = await fetchData();

  return (
    <main className="py-10 px-3 sm:px-8 lg:px-10 xl:px-20">
      <h1 className="text-5xl">Top Crystal Web Frameworks</h1>
      <div className="mt-4">
        A list of popular github projects related to Crystal web framework (ranked by stars automatically) Please update
        list.txt (via <a href="https://github.com/isaced/crystal-web-framework-stars/pulls">Pull Request</a>)
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
            {data?.map((repo, idx) => (
              <tr key={idx} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  <a href={repo.html_url} target="__blank">
                    {repo.name}
                  </a>
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

      <div className="sm:flex justify-between py-4 text-xs space-y-4">
        <div className="flex text-slate-400">
          <a
            href="https://github.com/isaced/crystal-web-framework-stars"
            className="flex justify-center items-center space-x-1"
            target="_blank"
          >
            <Image
              src="https://avatars.githubusercontent.com/in/15368?s=48&v=4"
              className="rounded-full overflow-hidden"
              alt={"Github Page"}
              width={20}
              height={20}
            />
            <span>isaced/crystal-web-framework-stars</span>
          </a>
        </div>

        <a
          className="pointer-events-none flex gap-2 lg:pointer-events-auto text-gray-500 dark:text-white"
          href="https://vercel.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Deploy By{" "}
          <Image src="/vercel.svg" alt="Vercel Logo" className="dark:invert" width={50} height={50} priority />
        </a>
      </div>
    </main>
  );
}
