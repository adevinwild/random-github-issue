import { GithubIcon } from 'lucide-react'
import Link from 'next/link'

export default function Header() {
  return (
    <Link href="/" className="flex md:flex-row flex-col items-center gap-2 w-full">
      <GithubIcon />
      <div className="flex flex-col gap-0.5 text-balance text-center md:text-left">
        <h1 className="text-2xl font-bold">Random GitHub Issue</h1>
        <p className="text-sm text-neutral-500">
          A random opened GitHub issue per day for any repository.
        </p>
      </div>
    </Link>
  )
}
