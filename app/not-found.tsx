import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-zinc-50 text-black dark:bg-black dark:text-white">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-zinc-800 to-zinc-500 dark:from-white dark:to-zinc-500">
          How did you get here?
        </h1>
        <img src="./other/Error_404.png" alt="404" />
        <div className="space-y-2 text-gray-600 dark:text-gray-400">
          <p>
            This entire portfolio is a single page site.
          </p>  
          <p>
            Yet somehow, you reached a page that doesn't exist. Impressive.
          </p>
        </div>

        <Link 
          href="/"
          className="inline-block mt-4 px-6 py-2 border rounded-full bg-black text-white dark:bg-white dark:text-black transition-all duration-300"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
