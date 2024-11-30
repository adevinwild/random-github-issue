import { GithubIcon } from "lucide-react";
import Link from "next/link";
import SearchInput from "./_search-input";
import Footer from "./_footer";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Link href="/" className="flex items-center gap-2">
          <GithubIcon />
          <div className="flex flex-col gap-0.5">
            <h1 className="text-2xl font-bold">Random GitHub Issue</h1>
            <p className="text-sm text-neutral-500">
              A random opened GitHub issue per day for any repository.
            </p>
          </div>
        </Link>
        <SearchInput />
      </main>
      <Footer />
    </div>
  );
}
