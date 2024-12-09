import Link from 'next/link'
import React from 'react'

export default function Footer() {
  return (
    <footer className="row-start-3 flex gap-6 flex-1 flex-wrap items-end justify-center" role="contentinfo" aria-label="Site footer">
      <p className="text-sm text-neutral-400">
        Based on this <Link href="https://x.com/peer_rich/status/1862609684768649570" rel="noopener noreferrer" target="_blank" className="underline underline-offset-4 hover:text-neutral-700" aria-label="View original tweet by peer_rich">tweet</Link>,{" "}
        made by <Link href="https://x.com/adevinwild" rel="noopener noreferrer" target="_blank" className="underline underline-offset-4 hover:text-neutral-700" aria-label="Visit adevinwild's X profile">adevinwild</Link> and <Link href="https://github.com/adevinwild/random-github-issue" rel="noopener noreferrer" target="_blank" className="underline underline-offset-4 hover:text-neutral-700" aria-label="View source code on GitHub">open source</Link>
      </p>
    </footer>
  )
}
