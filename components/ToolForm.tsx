"use client";
import { useActionState, useState } from "react";
import type { ToolResult } from "@/lib/compute";

export type Field =
  | { kind: "text"; name: string; label: string; placeholder?: string; defaultValue?: string; password?: boolean }
  | { kind: "textarea"; name: string; label: string; placeholder?: string; rows?: number }
  | { kind: "number"; name: string; label: string; defaultValue: number; min: number; max: number }
  | { kind: "checkbox"; name: string; label: string; defaultChecked?: boolean }
  | { kind: "select"; name: string; label: string; options: [string, string][]; defaultValue?: string };

type Action = (prev: ToolResult | null, f: FormData) => Promise<ToolResult>;

const inputCls =
  "w-full rounded-lg bg-ink border border-edge px-3 py-2 text-sm placeholder:text-mut focus:border-tor font-mono";

export function ToolForm({
  action,
  fields,
  submitLabel = "Run",
  clientCompute,
  mono = true,
}: {
  action: Action;
  fields: Field[];
  submitLabel?: string;
  /** When provided and JS is on, results are computed locally and nothing is sent to the server. */
  clientCompute?: (f: FormData) => ToolResult;
  mono?: boolean;
}) {
  const [serverResult, formAction, pending] = useActionState(action, null);
  const [localResult, setLocalResult] = useState<ToolResult | null>(null);
  const [copied, setCopied] = useState(false);
  const result = localResult ?? serverResult;

  const onSubmit = clientCompute
    ? (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // stay on-device
        setCopied(false);
        try {
          setLocalResult(clientCompute(new FormData(e.currentTarget)));
        } catch (err) {
          setLocalResult({ error: (err as Error).message });
        }
      }
    : undefined;

  const copy = async () => {
    if (result?.output) {
      await navigator.clipboard.writeText(result.output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="grid gap-6">
      <form action={formAction} onSubmit={onSubmit} className="grid gap-4">
        {fields.map((f) => (
          <div key={f.name} className={f.kind === "checkbox" ? "flex items-center gap-2" : "grid gap-1.5"}>
            {f.kind !== "checkbox" && (
              <label htmlFor={f.name} className="text-sm text-mut">
                {f.label}
              </label>
            )}
            {f.kind === "text" && (
              <input
                id={f.name}
                name={f.name}
                type={f.password ? "password" : "text"}
                placeholder={f.placeholder}
                defaultValue={f.defaultValue}
                className={inputCls}
              />
            )}
            {f.kind === "textarea" && (
              <textarea id={f.name} name={f.name} rows={f.rows ?? 6} placeholder={f.placeholder} className={inputCls} />
            )}
            {f.kind === "number" && (
              <input
                id={f.name}
                name={f.name}
                type="number"
                defaultValue={f.defaultValue}
                min={f.min}
                max={f.max}
                className={inputCls + " max-w-32"}
              />
            )}
            {f.kind === "select" && (
              <select id={f.name} name={f.name} defaultValue={f.defaultValue} className={inputCls + " max-w-56"}>
                {f.options.map(([v, label]) => (
                  <option key={v} value={v}>
                    {label}
                  </option>
                ))}
              </select>
            )}
            {f.kind === "checkbox" && (
              <>
                <input
                  id={f.name}
                  name={f.name}
                  type="checkbox"
                  defaultChecked={f.defaultChecked}
                  className="size-4 accent-(--color-tor)"
                />
                <label htmlFor={f.name} className="text-sm text-mut">
                  {f.label}
                </label>
              </>
            )}
          </div>
        ))}
        <button
          disabled={pending}
          className="justify-self-start rounded-lg bg-tor/15 border border-tor-dim text-fg px-5 py-2 text-sm hover:bg-tor/25 disabled:opacity-50"
        >
          {pending ? "Working…" : submitLabel}
        </button>
      </form>

      {result?.error && (
        <p role="alert" className="rounded-lg border border-warn/40 bg-warn/10 px-3 py-2 text-sm text-warn">
          {result.error}
        </p>
      )}

      {result?.output != null && !result.error && (
        <section aria-label="Result" className="rounded-xl border border-edge bg-panel">
          <div className="flex items-center justify-between border-b border-edge px-3 py-2">
            <span className="font-mono text-[10px] tracking-widest text-mut">RESULT</span>
            <button onClick={copy} className="text-xs text-tor hover:underline">
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <pre className={`px-3 py-3 text-sm whitespace-pre-wrap break-all ${mono ? "font-mono" : ""}`}>
            {result.output}
          </pre>
          {result.meta && (
            <dl className="border-t border-edge px-3 py-2 text-xs text-mut space-y-1">
              {result.meta.map(([k, v]) => (
                <div key={k} className="flex gap-2">
                  <dt className="shrink-0">{k}:</dt>
                  <dd className="text-fg/80">{v}</dd>
                </div>
              ))}
            </dl>
          )}
        </section>
      )}

      {result?.svg && (
        <section aria-label="QR code" className="rounded-xl border border-edge bg-white p-4 w-fit">
          <div dangerouslySetInnerHTML={{ __html: result.svg }} className="[&>svg]:size-56" />
        </section>
      )}
    </div>
  );
}
