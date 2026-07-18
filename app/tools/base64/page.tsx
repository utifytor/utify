import { ToolShell } from "@/components/ToolShell";
import { Base64Form } from "@/components/forms";
import { getTool } from "@/lib/tools";

export const metadata = { title: getTool("base64")!.name };

export default function Page() {
  return (
    <ToolShell slug="base64">
      <Base64Form />
    </ToolShell>
  );
}
