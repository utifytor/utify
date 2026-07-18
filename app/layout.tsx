import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Utify — privacy utilities for Tor", template: "%s · Utify" },
  description:
    "Free, open-source, privacy-first utilities. Client-side whenever possible, no ads, no tracking.",
};

const DONATE = [
  ["Monero", "monero:REPLACE_WITH_XMR_ADDRESS"],
  ["Bitcoin", "bitcoin:REPLACE_WITH_BTC_ADDRESS"],
  ["Litecoin", "litecoin:REPLACE_WITH_LTC_ADDRESS"],
] as const;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased">
        <header className="border-b border-edge">
          <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
            <Link href="/" className="font-mono text-lg tracking-tight text-fg">
              <span className="text-tor">u</span>tify
            </Link>
            <nav className="flex items-center gap-5 text-sm text-mut">
              <Link href="/#tools" className="hover:text-fg">
                Tools
              </Link>
              <Link href="/about" className="hover:text-fg">
                Why Utify
              </Link>
              <a href="https://github.com/utifytor/utify" className="hover:text-fg">
                Source
              </a>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-edge mt-16">
          <div className="mx-auto max-w-5xl px-4 py-10 text-sm text-mut space-y-4">
            <p className="text-fg font-medium">Utify is free forever.</p>
            <p>
              Every tool runs locally in your browser whenever possible.
              <br />
              No ads. No tracking. Open source.
            </p>
            <p>If Utify has helped you, consider supporting development.</p>
            <ul className="font-mono text-xs space-y-1 break-all">
              {DONATE.map(([coin, uri]) => (
                <li key={coin}>
                  <span className="text-tor">{coin}</span>{" "}
                  <span className="select-all">{uri.split(":")[1]}</span>
                </li>
              ))}
            </ul>
            <p className="pt-2 text-xs">
              Works with JavaScript disabled (Tor Browser “Safest”). File tools are the only
              exception — they run in your browser precisely so your files never touch a server.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
