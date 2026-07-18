"use client";

import { useState } from "react";
import { md5 } from "@/lib/md5";

/** Shown when JS is off: we refuse to fall back to uploading files. */
export function NoJsNotice() {
  return (
    <noscript>
      <p className="rounded-lg border border-warn/40 bg-warn/10 px-3 py-3 text-sm text-warn">
        This tool needs JavaScript — not to track you, but so your file can be processed entirely
        on your device. We will never offer a server-upload fallback for files. Enable JavaScript
        for this page (Tor Browser: “Standard” or “Safer”), or use a local tool like{" "}
        <code>sha256sum</code> / <code>exiftool</code>.
      </p>
    </noscript>
  );
}

const fileCls =
  "block w-full text-sm text-mut file:mr-3 file:rounded-lg file:border file:border-edge file:bg-panel file:px-4 file:py-2 file:text-fg file:text-sm file:cursor-pointer hover:file:border-tor-dim file:border-solid";

function ResultBlock({ rows }: { rows: [string, string][] }) {
  return (
    <dl className="rounded-xl border border-edge bg-panel divide-y divide-(--color-edge) text-sm">
      {rows.map(([k, v]) => (
        <div key={k} className="px-3 py-2 grid sm:grid-cols-[10rem_1fr] gap-1">
          <dt className="text-mut">{k}</dt>
          <dd className="font-mono break-all select-all">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

// ---------- File hash generator ----------
export function HashTool() {
  const [rows, setRows] = useState<[string, string][] | null>(null);
  const [busy, setBusy] = useState(false);

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    const buf = new Uint8Array(await file.arrayBuffer());
    const dig = async (alg: string) =>
      [...new Uint8Array(await crypto.subtle.digest(alg, buf))]
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    setRows([
      ["File", `${file.name} (${(file.size / 1024).toFixed(1)} KiB)`],
      ["SHA-256", await dig("SHA-256")],
      ["SHA-512", await dig("SHA-512")],
      ["MD5 (legacy)", md5(buf)],
    ]);
    setBusy(false);
  };

  return (
    <div className="grid gap-4">
      <NoJsNotice />
      <input type="file" aria-label="Choose a file to hash" className={fileCls} onChange={(e) => onFile(e.target.files?.[0])} />
      {busy && <p className="text-sm text-mut">Hashing locally…</p>}
      {rows && <ResultBlock rows={rows} />}
    </div>
  );
}

// ---------- EXIF viewer ----------
export function ExifTool() {
  const [rows, setRows] = useState<[string, string][] | null>(null);
  const [note, setNote] = useState("");

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setNote("Reading locally…");
    const exifr = (await import("exifr")).default;
    try {
      const data = (await exifr.parse(file, { gps: true })) ?? {};
      const entries = Object.entries(data)
        .filter(([, v]) => v != null && typeof v !== "object")
        .map(([k, v]) => [k, String(v)] as [string, string]);
      if (data.latitude && data.longitude) {
        entries.unshift(["⚠ GPS position", `${data.latitude}, ${data.longitude}`]);
      }
      setRows(entries);
      setNote(entries.length ? `${entries.length} fields found in ${file.name}` : `No EXIF metadata found in ${file.name}. Good.`);
    } catch {
      setRows(null);
      setNote("Couldn't parse this file — it may not contain EXIF data.");
    }
  };

  return (
    <div className="grid gap-4">
      <NoJsNotice />
      <input type="file" accept="image/*" aria-label="Choose an image to inspect" className={fileCls} onChange={(e) => onFile(e.target.files?.[0])} />
      {note && <p className="text-sm text-mut">{note}</p>}
      {rows && rows.length > 0 && <ResultBlock rows={rows} />}
    </div>
  );
}

// ---------- Metadata remover (canvas re-encode) ----------
export function StripTool() {
  const [out, setOut] = useState<{ url: string; name: string; size: number } | null>(null);
  const [err, setErr] = useState("");

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setErr("");
    try {
      const bitmap = await createImageBitmap(file);
      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      canvas.getContext("2d")!.drawImage(bitmap, 0, 0);
      const type = file.type === "image/png" ? "image/png" : "image/jpeg";
      const blob: Blob = await new Promise((res, rej) =>
        canvas.toBlob((b) => (b ? res(b) : rej(new Error("Encoding failed"))), type, 0.95)
      );
      if (out) URL.revokeObjectURL(out.url);
      const base = file.name.replace(/\.[^.]+$/, "");
      setOut({
        url: URL.createObjectURL(blob),
        name: `${base}-clean.${type === "image/png" ? "png" : "jpg"}`,
        size: blob.size,
      });
    } catch {
      setErr("Couldn't decode this image. Supported: JPEG, PNG, WebP, GIF (first frame).");
    }
  };

  return (
    <div className="grid gap-4">
      <NoJsNotice />
      <input type="file" accept="image/*" aria-label="Choose an image to clean" className={fileCls} onChange={(e) => onFile(e.target.files?.[0])} />
      {err && <p className="text-sm text-warn">{err}</p>}
      {out && (
        <div className="rounded-xl border border-edge bg-panel p-4 grid gap-3">
          <p className="text-sm text-mut">
            Re-encoded without metadata ({(out.size / 1024).toFixed(1)} KiB). Pixels only — EXIF,
            GPS, color-profile tags and thumbnails are gone.
          </p>
          <a
            href={out.url}
            download={out.name}
            className="justify-self-start rounded-lg bg-tor/15 border border-tor-dim px-5 py-2 text-sm hover:bg-tor/25"
          >
            Download {out.name}
          </a>
        </div>
      )}
    </div>
  );
}
