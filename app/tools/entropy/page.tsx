import { ToolShell } from "@/components/ToolShell";
import { EntropyForm } from "@/components/forms";
import { getTool } from "@/lib/tools";

export const metadata = { title: getTool("entropy")!.name };

export default function Page() {
  return (
    <ToolShell slug="entropy">
      <EntropyForm />
    </ToolShell>
  );
}
