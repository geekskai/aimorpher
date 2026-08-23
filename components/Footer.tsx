import { TOGETHER_LINK } from '@/lib/utils';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-gray-200 px-6 py-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="text-center font-mono text-sm font-bold text-design-gray md:text-left">
          Powered by{' '}
          <a
            target="_blank"
            href={TOGETHER_LINK}
            className="text-design-black underline underline-offset-2"
          >
            Together.ai
          </a>{' '}
          for open-model inference
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-design-gray" aria-label="Footer navigation">
          <Link href="/sample">Sample</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/refund-policy">Refunds</Link>
        </nav>

        <div className="flex gap-2">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/geekskai/aimorpher"
            className="size-6 flex items-center justify-center border-design-gray border rounded-md"
          >
            <img src="/footer/github.svg" alt="" className="size-4" />
            <span className="sr-only">GitHub</span>
          </a>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://x.com/KaiGeeks"
            className="size-6 flex items-center justify-center border-design-gray border rounded-md"
          >
            <img src="/footer/x.svg" alt="" className="size-4" />
            <span className="sr-only">Social</span>
          </a>
        </div>

        <a href="https://sellwithboost.com" target="_blank" rel="noopener noreferrer nofollow">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://sellwithboost.com/badge/listing.svg"
            alt="Listed on Sell With boost"
            style={{ height: "40px", width: "auto" }}
          />
        </a>
      </div>
    </footer>
  );
}
