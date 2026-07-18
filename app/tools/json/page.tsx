import { ToolShell } from "@/components/ToolShell";
import { JsonForm } from "@/components/forms";
import { getTool } from "@/lib/tools";

export const metadata = { title: getTool("json")!.name };

export default function Page() {
  return (
    <ToolShell slug="json">
      <JsonForm />
    </ToolShell>
  );
}
