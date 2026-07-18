import { ToolShell } from "@/components/ToolShell";
import { JwtForm } from "@/components/forms";
import { getTool } from "@/lib/tools";

export const metadata = { title: getTool("jwt")!.name };

export default function Page() {
  return (
    <ToolShell slug="jwt">
      <JwtForm />
    </ToolShell>
  );
}
