import { ToolShell } from "@/components/ToolShell";
import { ExifTool } from "@/components/fileTools";
import { getTool } from "@/lib/tools";

export const metadata = { title: getTool("exif")!.name };

export default function Page() {
  return (
    <ToolShell slug="exif">
      <ExifTool />
    </ToolShell>
  );
}
