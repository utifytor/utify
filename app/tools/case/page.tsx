import { ToolShell } from "@/components/ToolShell";
import { CaseForm } from "@/components/forms";
import { getTool } from "@/lib/tools";

export const metadata = { title: getTool("case")!.name };

export default function Page() {
  return (
    <ToolShell slug="case">
      <CaseForm />
    </ToolShell>
  );
}
