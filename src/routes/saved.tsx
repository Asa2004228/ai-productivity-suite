import { createFileRoute } from "@tanstack/react-router";
import { Copy, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { AppShell, Disclaimer } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { deleteItem, getSaved, kindLabel, type SavedItem } from "@/lib/saved";

export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { title: "Saved Outputs — AI Workplace Assistant" },
      { name: "description", content: "Your saved emails, schedules and research analyses." },
      { property: "og:title", content: "Saved Outputs" },
      { property: "og:description", content: "Everything you saved, stored in your browser." },
    ],
  }),
  component: SavedPage,
});

function SavedPage() {
  const [items, setItems] = useState<SavedItem[]>([]);
  const refresh = useCallback(() => setItems(getSaved()), []);

  useEffect(() => {
    refresh();
    window.addEventListener("awpa-saved-changed", refresh);
    return () => window.removeEventListener("awpa-saved-changed", refresh);
  }, [refresh]);

  return (
    <AppShell title="Saved Outputs" description="Stored locally in this browser only.">
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">You haven't saved any outputs yet.</p>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => (
            <Card key={item.id}>
              <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
                <div>
                  <CardTitle className="text-base">{item.title}</CardTitle>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {kindLabel[item.kind]} · {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      await navigator.clipboard.writeText(item.content);
                      toast.success("Copied");
                    }}
                  >
                    <Copy className="size-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      deleteItem(item.id);
                      toast.success("Deleted");
                    }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea readOnly rows={8} value={item.content} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <Disclaimer />
    </AppShell>
  );
}
