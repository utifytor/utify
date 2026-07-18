export type Mode =
  | "client" // JS on: runs in your browser. JS off: honest notice, no silent upload.
  | "dual" // JS on: runs in your browser. JS off: falls back to in-memory server processing.
  | "server"; // Always computed server-side, in memory, nothing stored.

export interface Tool {
  slug: string;
  name: string;
  short: string; // card description
  category: "Files & privacy" | "Passwords & security" | "Developer" | "Misc";
  mode: Mode;
  privacy: string[]; // bullet notes shown on the tool page
  ready: boolean;
  keywords?: string;
}

const REPO = "https://github.com/utifytor/utify";

export const sourceUrl = (slug: string) => `${REPO}/tree/main/app/tools/${slug}`;

export const modeLabel: Record<Mode, string> = {
  client: "CLIENT-SIDE · JS REQUIRED",
  dual: "CLIENT-SIDE · NO-JS FALLBACK",
  server: "SERVER (IN-MEMORY) · NO-JS OK",
};

const noJsFallback =
  "Without JavaScript, the form posts to the server. Input is processed in memory and never written to disk or logs.";
const jsLocal = "With JavaScript enabled, everything runs in your browser. Nothing is sent anywhere.";

export const tools: Tool[] = [
  // Files & privacy
  {
    slug: "strip-metadata",
    name: "Metadata remover",
    short: "Strip EXIF, GPS and other metadata from images.",
    category: "Files & privacy",
    mode: "client",
    ready: true,
    privacy: [
      "Your file never leaves your device. It is re-encoded through a canvas, which discards all metadata.",
      "Requires JavaScript — we refuse to upload files to a server, even our own.",
      "Re-encoding may slightly recompress JPEGs.",
    ],
    keywords: "exif gps clean image photo",
  },
  {
    slug: "exif",
    name: "EXIF viewer",
    short: "Inspect what a photo reveals about you before you share it.",
    category: "Files & privacy",
    mode: "client",
    ready: true,
    privacy: [
      "Parsed locally with exifr. Your file never leaves your device.",
      "Requires JavaScript — file tools never upload to a server.",
    ],
    keywords: "metadata gps camera photo inspect",
  },
  {
    slug: "hash",
    name: "File hash generator",
    short: "SHA-256, SHA-512 and MD5 digests, computed locally.",
    category: "Files & privacy",
    mode: "client",
    ready: true,
    privacy: [
      "Hashing uses the Web Crypto API in your browser; MD5 is a small local implementation (kept for legacy checksums only — it is not secure).",
      "Requires JavaScript — file tools never upload to a server.",
    ],
    keywords: "sha256 sha512 md5 checksum digest verify",
  },
  {
    slug: "checksum",
    name: "Checksum verifier",
    short: "Compare a file against a published checksum.",
    category: "Files & privacy",
    mode: "client",
    ready: false,
    privacy: [],
    keywords: "verify sha256 download integrity",
  },
  {
    slug: "convert-image",
    name: "Image converter",
    short: "Convert between PNG, JPEG and WebP in your browser.",
    category: "Files & privacy",
    mode: "client",
    ready: false,
    privacy: [],
    keywords: "png jpg webp",
  },
  {
    slug: "pdf-metadata",
    name: "PDF metadata remover",
    short: "Remove author, producer and creation data from PDFs.",
    category: "Files & privacy",
    mode: "client",
    ready: false,
    privacy: [],
    keywords: "pdf author clean",
  },

  // Passwords & security
  {
    slug: "password",
    name: "Password generator",
    short: "Cryptographically random passwords with your rules.",
    category: "Passwords & security",
    mode: "dual",
    ready: true,
    privacy: [
      jsLocal + " Randomness comes from crypto.getRandomValues.",
      "Without JavaScript, the password is generated server-side from Node's CSPRNG, returned once, and never stored or logged.",
    ],
    keywords: "random secure generate",
  },
  {
    slug: "passphrase",
    name: "Passphrase generator",
    short: "Diceware-style word passphrases that are easy to remember.",
    category: "Passwords & security",
    mode: "dual",
    ready: true,
    privacy: [jsLocal, noJsFallback.replace("Input is", "The result is")],
    keywords: "diceware words xkcd",
  },
  {
    slug: "entropy",
    name: "Password entropy calculator",
    short: "Estimate how hard a password is to brute-force.",
    category: "Passwords & security",
    mode: "dual",
    ready: true,
    privacy: [
      jsLocal + " Prefer JS mode for this tool so the password stays on your device.",
      noJsFallback,
      "The estimate is a character-set model. It cannot detect dictionary words or reuse.",
    ],
    keywords: "strength bits crack",
  },
  {
    slug: "token",
    name: "Random token generator",
    short: "Hex, base64url or alphanumeric secrets for APIs and apps.",
    category: "Passwords & security",
    mode: "dual",
    ready: true,
    privacy: [jsLocal, noJsFallback.replace("Input is", "The token is")],
    keywords: "secret api key hex",
  },
  {
    slug: "uuid",
    name: "UUID generator",
    short: "Version 4 UUIDs, alone or in bulk.",
    category: "Passwords & security",
    mode: "dual",
    ready: true,
    privacy: [jsLocal, noJsFallback.replace("Input is", "The IDs are")],
    keywords: "guid v4 identifier",
  },

  // Developer
  {
    slug: "base64",
    name: "Base64 encode / decode",
    short: "UTF-8 safe Base64 in both directions.",
    category: "Developer",
    mode: "dual",
    ready: true,
    privacy: [jsLocal, noJsFallback],
    keywords: "encode decode b64",
  },
  {
    slug: "url-encode",
    name: "URL encode / decode",
    short: "Percent-encoding for URLs and query strings.",
    category: "Developer",
    mode: "dual",
    ready: true,
    privacy: [jsLocal, noJsFallback],
    keywords: "percent uri escape",
  },
  {
    slug: "json",
    name: "JSON formatter",
    short: "Validate, pretty-print or minify JSON.",
    category: "Developer",
    mode: "dual",
    ready: true,
    privacy: [jsLocal, noJsFallback],
    keywords: "pretty validate minify lint",
  },
  {
    slug: "jwt",
    name: "JWT decoder",
    short: "Decode header and payload of a JWT. Offline, no verification.",
    category: "Developer",
    mode: "dual",
    ready: true,
    privacy: [
      jsLocal + " Prefer JS mode so tokens stay on your device.",
      noJsFallback,
      "Decoding only — signatures are not verified. Never treat a decoded JWT as trusted.",
    ],
    keywords: "token claims header payload",
  },
  {
    slug: "diff",
    name: "Text diff checker",
    short: "Line-by-line comparison of two texts.",
    category: "Developer",
    mode: "dual",
    ready: false,
    privacy: [],
    keywords: "compare changes",
  },
  {
    slug: "markdown",
    name: "Markdown preview",
    short: "Render Markdown as you type.",
    category: "Developer",
    mode: "dual",
    ready: false,
    privacy: [],
    keywords: "md render",
  },

  // Misc
  {
    slug: "qr",
    name: "QR code generator",
    short: "Turn text or a URL into a downloadable QR code.",
    category: "Misc",
    mode: "server",
    ready: true,
    privacy: [
      "Rendered server-side as inline SVG so it works with JavaScript fully disabled.",
      "Your input is processed in memory to draw the SVG and is never stored or logged.",
    ],
    keywords: "qrcode svg link",
  },
  {
    slug: "qr-read",
    name: "QR code reader",
    short: "Decode a QR code from an image, locally.",
    category: "Misc",
    mode: "client",
    ready: false,
    privacy: [],
    keywords: "scan decode",
  },
  {
    slug: "case",
    name: "Text case converter",
    short: "UPPER, lower, Title, camelCase, snake_case, kebab-case.",
    category: "Misc",
    mode: "dual",
    ready: true,
    privacy: [jsLocal, noJsFallback],
    keywords: "uppercase lowercase camel snake kebab",
  },
  {
    slug: "random-string",
    name: "Random string generator",
    short: "Random strings from a custom alphabet.",
    category: "Misc",
    mode: "dual",
    ready: false,
    privacy: [],
    keywords: "characters custom",
  },
];

export const getTool = (slug: string) => tools.find((t) => t.slug === slug);
