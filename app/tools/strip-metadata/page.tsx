import { ToolShell } from "@/components/ToolShell";
import { StripTool } from "@/components/fileTools";
import { getTool } from "@/lib/tools";

export const metadata = { title: getTool("strip-metadata")!.name };

export default function Page() {
  return (
    <ToolShell slug="strip-metadata">
      <StripTool />
    </ToolShell>
  );
}
