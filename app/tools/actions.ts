"use server";

// The no-JS path. Each action wraps the same pure function the browser uses
// when JavaScript is enabled, so both modes are provably identical.
// Nothing here touches a database, the filesystem, or a log line.

import {
  base64,
  caseConvert,
  entropy,
  genPassphrase,
  genPassword,
  genToken,
  genUuid,
  jsonFormat,
  jwtDecode,
  urlEncode,
  type ToolResult,
} from "@/lib/compute";
import QRCode from "qrcode";

type Prev = ToolResult | null;

export async function passwordAction(_p: Prev, f: FormData) {
  return genPassword(f);
}
export async function passphraseAction(_p: Prev, f: FormData) {
  return genPassphrase(f);
}
export async function tokenAction(_p: Prev, f: FormData) {
  return genToken(f);
}
export async function uuidAction(_p: Prev, f: FormData) {
  return genUuid(f);
}
export async function entropyAction(_p: Prev, f: FormData) {
  return entropy(f);
}
export async function base64Action(_p: Prev, f: FormData) {
  return base64(f);
}
export async function urlAction(_p: Prev, f: FormData) {
  return urlEncode(f);
}
export async function jsonAction(_p: Prev, f: FormData) {
  return jsonFormat(f);
}
export async function jwtAction(_p: Prev, f: FormData) {
  return jwtDecode(f);
}
export async function caseAction(_p: Prev, f: FormData) {
  return caseConvert(f);
}

export async function qrAction(_p: Prev, f: FormData): Promise<ToolResult> {
  const text = String(f.get("text") || "").slice(0, 2000);
  if (!text) return { error: "Enter some text or a URL to encode." };
  const svg = await QRCode.toString(text, {
    type: "svg",
    errorCorrectionLevel: String(f.get("ecl") || "M") as "L" | "M" | "Q" | "H",
    margin: 2,
  });
  return { svg, meta: [["Characters", String(text.length)]] };
}
