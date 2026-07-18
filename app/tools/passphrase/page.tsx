import { ToolShell } from "@/components/ToolShell";
import { PassphraseForm } from "@/components/forms";
import { getTool } from "@/lib/tools";

export const metadata = { title: getTool("passphrase")!.name };

export default function Page() {
  return (
    <ToolShell slug="passphrase">
      <PassphraseForm />
    </ToolShell>
  );
}
