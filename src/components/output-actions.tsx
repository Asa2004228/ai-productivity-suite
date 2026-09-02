import { Copy, RefreshCw, Save, Pencil, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function OutputActions({
  editing,
  onToggleEdit,
  onCopy,
  onRegenerate,
  onSave,
  busy,
}: {
  editing: boolean;
  onToggleEdit: () => void;
  onCopy: () => string;
  onRegenerate: () => void;
  onSave: () => void;
  busy?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={onToggleEdit}>
        {editing ? <Check className="size-4" /> : <Pencil className="size-4" />}
        {editing ? "Done" : "Edit"}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={async () => {
          await navigator.clipboard.writeText(onCopy());
          toast.success("Copied to clipboard");
        }}
      >
        <Copy className="size-4" /> Copy
      </Button>
      <Button variant="outline" size="sm" onClick={onRegenerate} disabled={busy}>
        <RefreshCw className={`size-4 ${busy ? "animate-spin" : ""}`} /> Regenerate
      </Button>
      <Button size="sm" onClick={onSave}>
        <Save className="size-4" /> Save
      </Button>
    </div>
  );
}
