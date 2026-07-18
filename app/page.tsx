import Link from "next/link";
import { tools, modeLabel, type Tool } from "@/lib/tools";
import { LiveFilter } from "@/components/LiveFilter";

function matches(t: Tool, q: string) {
  const hay = `${t.name} ${t.short} ${t.category} ${t.keywords ?? ""}`.toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((w) => hay.includes(w));
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const shown = q ? tools.filter((t) => matches(t, q)) : tools;
  const categories = [...new Set(shown.map((t) => t.category))];

  return (
    <div className="mx-auto max-w-5xl px-4">
      <section className="py-14 sm:py-20">
        <p className="font-mono text-xs text-tor mb-4 tracking-widest">
          .ONION SERVICE · OPEN SOURCE · NO-JS FRIENDLY
        </p>
        <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight max-w-2xl">
          Small utilities that don’t want to know who you are.
        </h1>
        <p className="mt-4 text-mut max-w-xl">
          Every tool is free, open source and built to run in your browser. When JavaScript is off,
          text tools fall back to in-memory server processing — and file tools refuse to upload,
          full stop.
        </p>

        {/* No-JS search: plain GET form. LiveFilter upgrades it when JS is on. */}
        <form action="/" method="get" className="mt-8 flex gap-2 max-w-md" role="search">
          <input
            type="search"
            name="q"
            id="tool-search"
            defaultValue={q}
            placeholder="Search tools… (hash, exif, jwt)"
            className="flex-1 rounded-lg bg-panel border border-edge px-3 py-2 text-sm placeholder:text-mut focus:border-tor"
          />
          <button className="rounded-lg border border-edge bg-panel px-4 text-sm hover:border-tor">
            Search
          </button>
        </form>
        <LiveFilter />
      </section>

      <section id="tools" className="pb-8 space-y-10">
        {shown.length === 0 && (
          <p className="text-mut">
            Nothing matches “{q}”.{" "}
            <Link className="text-tor underline" href="/">
              Clear search
            </Link>{" "}
            or open an issue to request a tool.
          </p>
        )}
        {categories.map((cat) => (
          <div key={cat}>
            <h2 className="font-mono text-xs tracking-widest text-mut mb-3 uppercase">{cat}</h2>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {shown
                .filter((t) => t.category === cat)
                .map((t) => (
                  <li key={t.slug} data-tool={`${t.name} ${t.short} ${t.keywords ?? ""}`.toLowerCase()}>
                    <Link
                      href={t.ready ? `/tools/${t.slug}` : "#"}
                      aria-disabled={!t.ready}
                      className={`group block h-full rounded-xl border border-edge bg-panel p-4 transition-colors ${
                        t.ready ? "hover:border-tor-dim" : "opacity-50 cursor-default"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-medium">{t.name}</h3>
                        {!t.ready && (
                          <span className="font-mono text-[10px] text-mut border border-edge rounded px-1.5 py-0.5">
                            SOON
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-mut">{t.short}</p>
                      <p
                        className={`mt-3 font-mono text-[10px] tracking-wider ${
                          t.mode === "client" ? "text-ok" : t.mode === "dual" ? "text-ok" : "text-warn"
                        }`}
                      >
                        {modeLabel[t.mode]}
                      </p>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
}
