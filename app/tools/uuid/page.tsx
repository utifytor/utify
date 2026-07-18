import { ToolShell } from "@/components/ToolShell";
import { UuidForm } from "@/components/forms";
import { getTool } from "@/lib/tools";

export const metadata = { title: getTool("uuid")!.name };

export default function Page() {
  return (
    <ToolShell slug="uuid">
      <UuidForm />
    </ToolShell>
  );
}
