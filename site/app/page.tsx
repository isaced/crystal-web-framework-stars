import Image from "next/image";
import * as dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCodeFork, faClock, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
// Tell Font Awesome to skip adding the CSS automatically 
// since it's already imported above
config.autoAddCss = false;


dayjs.extend(localizedFormat);

const DATA_URL =
  "https://raw.githubusercontent.com/isaced/crystal-web-framework-stars/master/list.json";

interface Repo {
  name: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  description: string;
  last_commit_date: string;
}

const StarColors = [
  "text-rose-600 dark:text-rose-400",
  "text-rose-500 dark:text-rose-300",
  "text-rose-400 dark:text-rose-200"
];

async function fetchData() {
  return (await fetch(DATA_URL, {
    next: {
      revalidate: 86400 // 24 hours
    }
  })).json() as Promise<Repo[]>;
}

export default async function Home() {
  const data = await fetchData();

  return (
    <main className="container mx-auto py-10 px-3">
      <h1 className="text-5xl flex space-x-2">
        <Image src="/crystal-logo.png" alt={"Crystal Logo"} width={46} height={46} className="h-fit dark:invert" />
        <span>Top Crystal Web Frameworks</span>
      </h1>
      <div className="mt-4">
        A list of popular github projects related to Crystal web framework (ranked by stars automatically) Please update{" "}
        <a href="https://github.com/isaced/crystal-web-framework-stars/blob/master/list.txt" target="__blank">
          list.txt
        </a>{" "}
        (via{" "}
        <a href="https://github.com/isaced/crystal-web-framework-stars/pulls" target="__blank">
          Pull Request
        </a>
        )
      </div>
      <div className="relative overflow-x-auto mt-10 space-y-3">
        {data?.map((repo, idx) => (
          <a
            key={idx}
            href={repo.html_url}
            target="__blank"
            className="p-6 bg-white border border-gray-200 rounded-lg dark:bg-black dark:border-gray-700 dark:hover:bg-gray-900 flex items-center space-x-6 hover:bg-gray-50 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-100"
          >
            <div
              className={`w-20 text-2xl font-bold text-center tracking-tight ${StarColors[idx] ?? "text-gray-900 dark:text-white"
                } `}
            >
              {repo.stargazers_count}
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{repo.name}</h5>
                <div className="text-gray-500 text-xs space-x-3 flex">
                  <span className="flex items-center">
                    <FontAwesomeIcon icon={faClock} className="mr-1" />
                    {dayjs.default(repo.last_commit_date).format("LL").toString()}
                  </span>

                  <span className="flex items-center"> <FontAwesomeIcon icon={faCircleInfo} className="mr-1" /> {repo.open_issues_count}</span>
                  <span className="flex items-center"> <FontAwesomeIcon icon={faCodeFork} className="mr-1" /> {repo.forks_count}</span>

                </div>
              </div>
              <p className="font-normal text-gray-700 dark:text-gray-400">{repo.description}</p>
            </div>
          </a>
        ))}
      </div>

      <div className="sm:flex justify-between mt-6 py-4 text-xs space-y-4">
        <div className="flex text-slate-400">
          <a
            href="https://github.com/isaced/crystal-web-framework-stars"
            className="flex justify-center items-center space-x-1"
            target="_blank"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" className="dark:invert">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <span>crystal-web-framework-stars</span>
          </a>
        </div>

        <a
          className="pointer-events-none flex items-center gap-2 lg:pointer-events-auto text-gray-500 dark:text-white"
          href="https://vercel.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>Deploy By</span>
          <Image src="/vercel.svg" alt="Vercel Logo" className="dark:invert" width={50} height={50} />
        </a>
      </div>
    </main >
  );
}
