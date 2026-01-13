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
  organization?: {
    avatar_url: string;
  };
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
    <main className="container max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <div className="flex flex-col items-center justify-center text-center space-y-6 mb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight flex items-center justify-center gap-4 text-zinc-900 dark:text-white">
          <Image
            src="/crystal-logo.png"
            alt="Crystal Logo"
            width={56}
            height={56}
            className="h-auto w-12 sm:w-14 dark:invert"
          />
          <span>Top Crystal Web Frameworks</span>
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          A curated list of popular GitHub projects related to Crystal web frameworks.<br className="hidden sm:block" />
          Ranked by stars automatically.
        </p>
        <div className="flex items-center justify-center gap-4 text-sm font-medium">
          <a
            href="https://github.com/isaced/crystal-web-framework-stars/blob/master/list.txt"
            target="_blank"
            className="px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            Edit list.txt
          </a>
          <a
            href="https://github.com/isaced/crystal-web-framework-stars/pulls"
            target="_blank"
            className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
          >
            Submit Pull Request →
          </a>
        </div>
      </div>

      <div className="grid gap-4">
        {data?.map((repo, idx) => (
          <a
            key={idx}
            href={repo.html_url}
            target="_blank"
            className="group relative flex flex-col sm:flex-row items-start gap-5 p-5 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 rounded-2xl hover:border-zinc-300 dark:hover:border-white/20 hover:shadow-lg dark:hover:shadow-black/40 transition-all duration-300 ease-out"
          >
            {/* Rank Indicator (Subtle) */}
            <div className="absolute -left-3 -top-3 hidden sm:flex size-8 items-center justify-center rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-400 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
              #{idx + 1}
            </div>

            {/* Logo */}
            <div className="shrink-0">
              {repo.organization?.avatar_url ? (
                <Image
                  src={repo.organization.avatar_url}
                  alt={repo.name}
                  width={64}
                  height={64}
                  className="size-14 rounded-xl bg-gray-50 border border-zinc-100 dark:border-white/5 shadow-sm group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="size-14 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-white/5 flex items-center justify-center text-xl font-bold text-zinc-400 dark:text-zinc-600 group-hover:scale-105 transition-transform duration-300">
                  {repo.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0 w-full">
              <div className="flex flex-wrap items-start justify-between gap-y-2 gap-x-4 mb-2">
                <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {repo.name}
                </h3>

                {/* Stats Badge */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/5 group-hover:border-blue-100 dark:group-hover:border-blue-900/30 transition-colors">
                  <span className={`text-sm font-bold ${StarColors[idx] ?? "text-zinc-600 dark:text-zinc-400"}`}>
                    ★ {repo.stargazers_count.toLocaleString()}
                  </span>
                </div>
              </div>

              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed line-clamp-2 mb-4">
                {repo.description}
              </p>

              {/* Meta Info */}
              <div className="flex items-center flex-wrap gap-4 text-xs font-medium text-zinc-500 dark:text-zinc-500">
                <div className="flex items-center gap-1.5 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
                  <FontAwesomeIcon icon={faClock} className="w-3.5 h-3.5 opacity-70" />
                  <span>{dayjs(repo.last_commit_date).format("MMM D, YYYY")}</span>
                </div>
                <div className="flex items-center gap-1.5 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
                  <FontAwesomeIcon icon={faCircleInfo} className="w-3.5 h-3.5 opacity-70" />
                  <span>{repo.open_issues_count} issues</span>
                </div>
                <div className="flex items-center gap-1.5 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
                  <FontAwesomeIcon icon={faCodeFork} className="w-3.5 h-3.5 opacity-70" />
                  <span>{repo.forks_count} forks</span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="sm:flex justify-between mt-12 py-6 border-t border-zinc-100 dark:border-zinc-800 text-xs">
        <div className="flex items-center text-zinc-400 dark:text-zinc-600">
          <a
            href="https://github.com/isaced/crystal-web-framework-stars"
            className="flex items-center gap-2 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
            target="_blank"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" className="dark:invert opacity-60">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <span>crystal-web-framework-stars</span>
          </a>
        </div>

        <a
          className="flex items-center gap-2 mt-4 sm:mt-0 text-zinc-400 hover:text-zinc-600 dark:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          href="https://vercel.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>Deploy By</span>
          <Image src="/vercel.svg" alt="Vercel Logo" className="dark:invert opacity-80" width={60} height={60} />
        </a>
      </div>
    </main >
  );
}
