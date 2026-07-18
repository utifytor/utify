import { ToolShell } from "@/components/ToolShell";
import { QrForm } from "@/components/forms";
import { getTool } from "@/lib/tools";

export const metadata = { title: getTool("qr")!.name };

export default function Page() {
  return (
    <ToolShell slug="qr">
      <QrForm />
    </ToolShell>
  );
}
