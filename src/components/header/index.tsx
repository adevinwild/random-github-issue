import Link from 'next/link'
import ChristmasLogo from './christmas-logo'

export default function Header() {
  return (
    <header className="flex items-center justify-center w-full h-max">
      <Link href="/" className="flex md:flex-row flex-col items-center gap-4 w-full">
        <ChristmasLogo />
        <div className="flex flex-col gap-0.5 text-balance text-center md:text-left">
          <h1 id="main-heading" className="text-2xl font-bold">Random GitHub Issue</h1>
          <p className="text-sm text-neutral-500">
            Get a daily random issue suggestion from any GitHub repository
          </p>
        </div>
      </Link>
    </header>
  )
}
