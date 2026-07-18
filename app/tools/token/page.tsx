import { ToolShell } from "@/components/ToolShell";
import { TokenForm } from "@/components/forms";
import { getTool } from "@/lib/tools";

export const metadata = { title: getTool("token")!.name };

export default function Page() {
  return (
    <ToolShell slug="token">
      <TokenForm />
    </ToolShell>
  );
}
