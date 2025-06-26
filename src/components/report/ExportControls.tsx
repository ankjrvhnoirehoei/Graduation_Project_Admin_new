import { Button } from "../../components/ui/button";
import { Download, FileText } from "lucide-react";

export default function ExportControls() {
  return (
    <div className="flex gap-2">
      <Button variant="outline">
        <Download className="w-4 h-4 mr-2" /> Export Excel
      </Button>
      <Button variant="outline">
        <FileText className="w-4 h-4 mr-2" /> Export PDF
      </Button>
    </div>
  );
}
