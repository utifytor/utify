export const metadata = { title: "Why Utify" };

export default function About() {
  return (
    <article className="mx-auto max-w-2xl px-4 py-12 space-y-6 text-mut leading-relaxed">
      <h1 className="text-2xl font-semibold tracking-tight text-fg">Why Utify exists</h1>
      <p>
        Most “free online tools” are ad farms that quietly upload your files, fingerprint your
        browser, and sell what they learn. Utify is the opposite bet: a toolbox for Tor users where
        every claim is checkable, because every line of code is public.
      </p>
      <h2 className="text-lg font-medium text-fg pt-2">The three modes</h2>
      <p>
        Every tool declares one of three modes, printed in the corner of its card, and the badge is
        generated from the same code that routes your data:
      </p>
      <p>
        <span className="font-mono text-xs text-ok">CLIENT-SIDE · NO-JS FALLBACK</span> — with
        JavaScript on, the tool runs entirely in your browser and nothing is transmitted. With
        JavaScript off (Tor Browser “Safest”), the form posts to this onion service, the same pure
        function runs in memory, and the result comes back in the page. Nothing is written to disk
        or logs.
      </p>
      <p>
        <span className="font-mono text-xs text-ok">CLIENT-SIDE · JS REQUIRED</span> — file tools
        only. We think uploading your photos “just briefly” is a worse privacy trade than asking
        you to enable JavaScript for one page, so file tools simply refuse to work without it.
        Your files never leave your device, ever.
      </p>
      <p>
        <span className="font-mono text-xs text-warn">SERVER (IN-MEMORY) · NO-JS OK</span> — a few
        tools (like QR rendering as inline SVG) are computed server-side so they work with no
        JavaScript at all. Input is processed in memory and immediately discarded.
      </p>
      <h2 className="text-lg font-medium text-fg pt-2">Verify, don’t trust</h2>
      <p>
        The server actions and the in-browser code import the same functions from{" "}
        <code className="font-mono text-fg text-sm">lib/compute.ts</code>. You can read the source,
        build the site yourself, and diff the output. If a claim on this site can’t be verified
        from the repository, treat it as broken and open an issue.
      </p>
    </article>
  );
}
