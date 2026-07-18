import { ToolShell } from "@/components/ToolShell";
import { HashTool } from "@/components/fileTools";
import { getTool } from "@/lib/tools";

export const metadata = { title: getTool("hash")!.name };

export default function Page() {
  return (
    <ToolShell slug="hash">
      <HashTool />
    </ToolShell>
  );
}
