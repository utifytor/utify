// Pure, isomorphic tool logic. Imported by server actions (no-JS path)
// and by client components (JS path), so both modes share one implementation.

export type ToolResult = {
  output?: string;
  svg?: string;
  meta?: [string, string][];
  error?: string;
};

// ---------- randomness (works in Node 19+ and browsers) ----------
function randBytes(n: number): Uint8Array {
  const b = new Uint8Array(n);
  globalThis.crypto.getRandomValues(b);
  return b;
}

/** Unbiased random int in [0, max) via rejection sampling. */
function randInt(max: number): number {
  const limit = Math.floor(256 / max) * max;
  for (;;) {
    const [b] = randBytes(1);
    if (b < limit) return b % max;
  }
}

// ---------- passwords & tokens ----------
const SETS = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  digits: "0123456789",
  symbols: "!#$%&()*+-./:;<=>?@[]^_{|}~",
};

export function genPassword(f: FormData): ToolResult {
  const length = Math.min(256, Math.max(4, Number(f.get("length")) || 20));
  let alphabet = "";
  const chosen: string[] = [];
  for (const k of ["lower", "upper", "digits", "symbols"] as const) {
    if (f.get(k)) {
      alphabet += SETS[k];
      chosen.push(SETS[k]);
    }
  }
  if (!alphabet) return { error: "Pick at least one character set." };
  let pw: string[];
  do {
    pw = Array.from({ length }, () => alphabet[randInt(alphabet.length)]);
  } while (
    // guarantee every chosen set is represented (keeps sites happy)
    length >= chosen.length &&
    !chosen.every((set) => pw.some((c) => set.includes(c)))
  );
  const bits = (length * Math.log2(alphabet.length)).toFixed(0);
  return { output: pw.join(""), meta: [["Entropy", `≈ ${bits} bits`]] };
}

export function genToken(f: FormData): ToolResult {
  const bytes = Math.min(1024, Math.max(1, Number(f.get("bytes")) || 32));
  const fmt = String(f.get("format") || "hex");
  const b = randBytes(bytes);
  let out: string;
  if (fmt === "hex") {
    out = [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
  } else if (fmt === "base64url") {
    out = bytesToB64(b).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  } else {
    const a = SETS.lower + SETS.upper + SETS.digits;
    out = Array.from({ length: bytes }, () => a[randInt(a.length)]).join("");
  }
  return { output: out, meta: [["Bytes of randomness", String(bytes)]] };
}

export function genUuid(f: FormData): ToolResult {
  const count = Math.min(100, Math.max(1, Number(f.get("count")) || 1));
  const one = () => {
    const b = randBytes(16);
    b[6] = (b[6] & 0x0f) | 0x40;
    b[8] = (b[8] & 0x3f) | 0x80;
    const h = [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
    return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
  };
  return { output: Array.from({ length: count }, one).join("\n") };
}

export function entropy(f: FormData): ToolResult {
  const pw = String(f.get("password") || "");
  if (!pw) return { error: "Enter a password to analyse." };
  let pool = 0;
  if (/[a-z]/.test(pw)) pool += 26;
  if (/[A-Z]/.test(pw)) pool += 26;
  if (/[0-9]/.test(pw)) pool += 10;
  if (/[^a-zA-Z0-9]/.test(pw)) pool += 33;
  const bits = pw.length * Math.log2(pool || 1);
  const guessesPerSec = 1e10; // offline GPU attack, order of magnitude
  const seconds = 2 ** (bits - 1) / guessesPerSec;
  const verdict =
    bits < 40 ? "Very weak" : bits < 60 ? "Weak" : bits < 80 ? "Reasonable" : bits < 100 ? "Strong" : "Excellent";
  return {
    output: `${verdict} — ≈ ${bits.toFixed(1)} bits`,
    meta: [
      ["Length", String(pw.length)],
      ["Character pool", String(pool)],
      ["Offline crack time (10¹⁰ guesses/s)", humanTime(seconds)],
      ["Caveat", "Model assumes random characters; dictionary words are far weaker."],
    ],
  };
}

function humanTime(s: number): string {
  if (s < 1) return "instant";
  const units: [number, string][] = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [365, "day"],
    [1000, "year"],
    [1000, "thousand years"],
    [1e6, "million years"],
  ];
  let v = s;
  let name = "second";
  for (const [div, n] of units) {
    name = n;
    if (v < div) break;
    v /= div;
  }
  return `≈ ${v.toFixed(1)} ${name}${v >= 2 && !name.includes("years") ? "s" : ""}`;
}

// ---------- encoders ----------
function bytesToB64(b: Uint8Array): string {
  let bin = "";
  b.forEach((x) => (bin += String.fromCharCode(x)));
  // btoa exists in browsers and Node 16+
  return btoa(bin);
}
function b64ToBytes(s: string): Uint8Array {
  const bin = atob(s);
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

export function base64(f: FormData): ToolResult {
  const text = String(f.get("text") || "");
  const dir = String(f.get("direction") || "encode");
  try {
    if (dir === "encode") {
      return { output: bytesToB64(new TextEncoder().encode(text)) };
    }
    const cleaned = text.trim().replace(/-/g, "+").replace(/_/g, "/");
    return { output: new TextDecoder("utf-8", { fatal: false }).decode(b64ToBytes(cleaned)) };
  } catch {
    return { error: "That doesn't look like valid Base64." };
  }
}

export function urlEncode(f: FormData): ToolResult {
  const text = String(f.get("text") || "");
  const dir = String(f.get("direction") || "encode");
  try {
    return { output: dir === "encode" ? encodeURIComponent(text) : decodeURIComponent(text.replace(/\+/g, "%20")) };
  } catch {
    return { error: "Malformed percent-encoding." };
  }
}

export function jsonFormat(f: FormData): ToolResult {
  const text = String(f.get("text") || "");
  const mode = String(f.get("mode") || "pretty");
  try {
    const parsed = JSON.parse(text);
    return {
      output: mode === "minify" ? JSON.stringify(parsed) : JSON.stringify(parsed, null, 2),
      meta: [["Valid", "yes"]],
    };
  } catch (e) {
    return { error: `Invalid JSON — ${(e as Error).message}` };
  }
}

export function jwtDecode(f: FormData): ToolResult {
  const token = String(f.get("text") || "").trim();
  const parts = token.split(".");
  if (parts.length < 2) return { error: "A JWT has at least two dot-separated parts." };
  const dec = (p: string) => {
    const b = b64ToBytes(p.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (p.length % 4)) % 4));
    return JSON.parse(new TextDecoder().decode(b));
  };
  try {
    const header = dec(parts[0]);
    const payload = dec(parts[1]);
    const meta: [string, string][] = [["Signature", "present but NOT verified"]];
    if (payload.exp) meta.push(["Expires", new Date(payload.exp * 1000).toISOString()]);
    return {
      output: `// header\n${JSON.stringify(header, null, 2)}\n\n// payload\n${JSON.stringify(payload, null, 2)}`,
      meta,
    };
  } catch {
    return { error: "Could not decode — is this a well-formed JWT?" };
  }
}

export function caseConvert(f: FormData): ToolResult {
  const text = String(f.get("text") || "");
  const mode = String(f.get("mode") || "upper");
  const words = text
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((w) => w.toLowerCase());
  const cap = (w: string) => w.charAt(0).toUpperCase() + w.slice(1);
  const out: Record<string, () => string> = {
    upper: () => text.toUpperCase(),
    lower: () => text.toLowerCase(),
    title: () => text.toLowerCase().replace(/\b\p{L}/gu, (c) => c.toUpperCase()),
    sentence: () => text.toLowerCase().replace(/(^\s*\p{L}|[.!?]\s+\p{L})/gu, (c) => c.toUpperCase()),
    camel: () => words.map((w, i) => (i ? cap(w) : w)).join(""),
    pascal: () => words.map(cap).join(""),
    snake: () => words.join("_"),
    kebab: () => words.join("-"),
  };
  return { output: (out[mode] || out.upper)() };
}

// ---------- passphrase ----------
import { WORDS } from "./words";

export function genPassphrase(f: FormData): ToolResult {
  const count = Math.min(24, Math.max(3, Number(f.get("words")) || 6));
  const sep = String(f.get("separator") ?? "-") || "-";
  const capitalize = Boolean(f.get("capitalize"));
  const pick = () => {
    const w = WORDS[randInt(256)];
    return capitalize ? w[0].toUpperCase() + w.slice(1) : w;
  };
  const phrase = Array.from({ length: count }, pick).join(sep);
  return {
    output: phrase,
    meta: [["Entropy", `${count * 8} bits (256-word list, 8 bits/word)`]],
  };
}
