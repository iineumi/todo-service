"use client";

import Head from "next/head";
import Image from "next/image";

const name = "hayate";

export default function Home() {
  return (
    <div className="bg-gray-100 grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Head>
        <title>Home Page</title>
      </Head>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {/* Hero Section */}
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <a className="mb-2">効率的にタスクをこなすためのとても便利なツール</a>
        </ol>
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="bg-blue-500 text-white font-bold rounded-full border border-solid border-transparent transition-colors flex items-center justify-center text-background gap-2 hover:bg-[#87ceeb] dark:hover:bg-[#87ceeb] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-32"
            href="/demo"
            target="_blank"
            rel="noopener noreferrer"
          >
            Demo
          </a>
          <a
            className="bg-black text-white font-bold rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#383838] dark:hover:bg-[#ccc] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="#"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/GitHub_Lockup_Light.svg"
              alt="Github Logo"
              width={80}
              height={20}
            />
          </a>
        </div>

        {/* Feature Section */}
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <p className="flex items-center gap-2 hover:underline hover:underline-offset-4">
          © 2024 {name}. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
