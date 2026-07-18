import { ToolShell } from "@/components/ToolShell";
import { PasswordForm } from "@/components/forms";
import { getTool } from "@/lib/tools";

export const metadata = { title: getTool("password")!.name };

export default function Page() {
  return (
    <ToolShell slug="password">
      <PasswordForm />
    </ToolShell>
  );
}
