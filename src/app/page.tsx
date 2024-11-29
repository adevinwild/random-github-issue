import { GithubIcon } from "lucide-react";
import Link from "next/link";
import SearchInput from "./_search-input";

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
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <p className="text-sm text-neutral-400">
          Based on this <Link href="https://x.com/peer_rich/status/1862609684768649570" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-neutral-700">tweet</Link>,{" "}
          made by <Link href="https://x.com/adevinwild" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-neutral-700">adevinwild</Link>
        </p>
      </footer>
    </div>
  );
}
