import Link from "next/link";
import { getTool, modeLabel, sourceUrl } from "@/lib/tools";

export function ToolShell({ slug, children }: { slug: string; children: React.ReactNode }) {
  const tool = getTool(slug);
  if (!tool) return null;
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <nav className="text-sm text-mut mb-6">
        <Link href="/" className="hover:text-fg">
          ← All tools
        </Link>
      </nav>
      <header className="mb-8">
        <p
          className={`font-mono text-[10px] tracking-wider mb-2 ${
            tool.mode === "server" ? "text-warn" : "text-ok"
          }`}
        >
          {modeLabel[tool.mode]}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">{tool.name}</h1>
        <p className="mt-1 text-mut">{tool.short}</p>
      </header>

      {children}

      <aside className="mt-10 rounded-xl border border-edge bg-panel p-4">
        <h2 className="font-mono text-xs tracking-widest text-mut uppercase mb-2">Privacy notes</h2>
        <ul className="space-y-1.5 text-sm text-mut list-disc pl-4">
          {tool.privacy.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
        <p className="mt-3 text-sm">
          <a href={sourceUrl(slug)} className="text-tor hover:underline">
            Read this tool’s source →
          </a>
        </p>
      </aside>
    </div>
  );
}
