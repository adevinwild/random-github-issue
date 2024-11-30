import Link from 'next/link'
import React from 'react'

export default function Footer() {
  return (
    <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      <p className="text-sm text-neutral-400">
        Based on this <Link href="https://x.com/peer_rich/status/1862609684768649570" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-neutral-700">tweet</Link>,{" "}
        made by <Link href="https://x.com/adevinwild" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-neutral-700">adevinwild</Link> and <Link href="https://github.com/adevinwild/random-github-issue" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-neutral-700">open source</Link>
      </p>
    </footer>
  )
}
