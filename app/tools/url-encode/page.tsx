import { ToolShell } from "@/components/ToolShell";
import { UrlForm } from "@/components/forms";
import { getTool } from "@/lib/tools";

export const metadata = { title: getTool("url-encode")!.name };

export default function Page() {
  return (
    <ToolShell slug="url-encode">
      <UrlForm />
    </ToolShell>
  );
}
