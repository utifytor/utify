"use client";

// One small form per dual-mode tool. Each pairs a server action (no-JS path)
// with the same pure function run locally (JS path).

import { ToolForm } from "./ToolForm";
import * as A from "@/app/tools/actions";
import * as C from "@/lib/compute";

export const PasswordForm = () => (
  <ToolForm
    action={A.passwordAction}
    clientCompute={C.genPassword}
    submitLabel="Generate password"
    fields={[
      { kind: "number", name: "length", label: "Length", defaultValue: 20, min: 4, max: 256 },
      { kind: "checkbox", name: "lower", label: "Lowercase (a–z)", defaultChecked: true },
      { kind: "checkbox", name: "upper", label: "Uppercase (A–Z)", defaultChecked: true },
      { kind: "checkbox", name: "digits", label: "Digits (0–9)", defaultChecked: true },
      { kind: "checkbox", name: "symbols", label: "Symbols (!#$%…)", defaultChecked: true },
    ]}
  />
);

export const PassphraseForm = () => (
  <ToolForm
    action={A.passphraseAction}
    clientCompute={C.genPassphrase}
    submitLabel="Generate passphrase"
    fields={[
      { kind: "number", name: "words", label: "Words", defaultValue: 6, min: 3, max: 24 },
      { kind: "text", name: "separator", label: "Separator", defaultValue: "-", placeholder: "-" },
      { kind: "checkbox", name: "capitalize", label: "Capitalize each word" },
    ]}
  />
);

export const TokenForm = () => (
  <ToolForm
    action={A.tokenAction}
    clientCompute={C.genToken}
    submitLabel="Generate token"
    fields={[
      { kind: "number", name: "bytes", label: "Bytes of randomness", defaultValue: 32, min: 1, max: 1024 },
      {
        kind: "select",
        name: "format",
        label: "Format",
        defaultValue: "hex",
        options: [
          ["hex", "Hex"],
          ["base64url", "Base64url"],
          ["alnum", "Alphanumeric"],
        ],
      },
    ]}
  />
);

export const UuidForm = () => (
  <ToolForm
    action={A.uuidAction}
    clientCompute={C.genUuid}
    submitLabel="Generate"
    fields={[{ kind: "number", name: "count", label: "How many", defaultValue: 5, min: 1, max: 100 }]}
  />
);

export const EntropyForm = () => (
  <ToolForm
    action={A.entropyAction}
    clientCompute={C.entropy}
    submitLabel="Estimate strength"
    fields={[
      {
        kind: "text",
        name: "password",
        label: "Password (analysed locally when JS is on)",
        placeholder: "correct-horse-battery…",
      },
    ]}
  />
);

import type { Field } from "./ToolForm";

const dirField: Field = {
  kind: "select",
  name: "direction",
  label: "Direction",
  defaultValue: "encode",
  options: [
    ["encode", "Encode"],
    ["decode", "Decode"],
  ],
};

export const Base64Form = () => (
  <ToolForm
    action={A.base64Action}
    clientCompute={C.base64}
    submitLabel="Convert"
    fields={[{ kind: "textarea", name: "text", label: "Input", placeholder: "Text or Base64…" }, dirField]}
  />
);

export const UrlForm = () => (
  <ToolForm
    action={A.urlAction}
    clientCompute={C.urlEncode}
    submitLabel="Convert"
    fields={[{ kind: "textarea", name: "text", label: "Input", rows: 4 }, dirField]}
  />
);

export const JsonForm = () => (
  <ToolForm
    action={A.jsonAction}
    clientCompute={C.jsonFormat}
    submitLabel="Format"
    fields={[
      { kind: "textarea", name: "text", label: "JSON", rows: 10, placeholder: '{"hello": "world"}' },
      {
        kind: "select",
        name: "mode",
        label: "Output",
        defaultValue: "pretty",
        options: [
          ["pretty", "Pretty-print"],
          ["minify", "Minify"],
        ],
      },
    ]}
  />
);

export const JwtForm = () => (
  <ToolForm
    action={A.jwtAction}
    clientCompute={C.jwtDecode}
    submitLabel="Decode"
    fields={[{ kind: "textarea", name: "text", label: "JWT (decoded locally when JS is on)", rows: 5, placeholder: "eyJ…" }]}
  />
);

export const CaseForm = () => (
  <ToolForm
    action={A.caseAction}
    clientCompute={C.caseConvert}
    submitLabel="Convert"
    fields={[
      { kind: "textarea", name: "text", label: "Text", rows: 5 },
      {
        kind: "select",
        name: "mode",
        label: "Case",
        defaultValue: "upper",
        options: [
          ["upper", "UPPERCASE"],
          ["lower", "lowercase"],
          ["title", "Title Case"],
          ["sentence", "Sentence case"],
          ["camel", "camelCase"],
          ["pascal", "PascalCase"],
          ["snake", "snake_case"],
          ["kebab", "kebab-case"],
        ],
      },
    ]}
  />
);

export const QrForm = () => (
  <ToolForm
    action={A.qrAction}
    submitLabel="Generate QR code"
    fields={[
      { kind: "textarea", name: "text", label: "Text or URL", rows: 3, placeholder: "http://example.onion" },
      {
        kind: "select",
        name: "ecl",
        label: "Error correction",
        defaultValue: "M",
        options: [
          ["L", "L — smallest"],
          ["M", "M — balanced"],
          ["Q", "Q — robust"],
          ["H", "H — maximum"],
        ],
      },
    ]}
  />
);
