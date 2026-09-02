export type SavedKind = "email" | "planner" | "research";

export type SavedItem = {
  id: string;
  kind: SavedKind;
  title: string;
  content: string;
  createdAt: string;
};

const KEY = "awpa.saved";

function read(): SavedItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) || "[]") as SavedItem[];
  } catch {
    return [];
  }
}

export function getSaved(): SavedItem[] {
  return read();
}

export function saveItem(kind: SavedKind, title: string, content: string): SavedItem {
  const item: SavedItem = {
    id: crypto.randomUUID(),
    kind,
    title,
    content,
    createdAt: new Date().toISOString(),
  };
  const next = [item, ...read()].slice(0, 200);
  window.localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("awpa-saved-changed"));
  return item;
}

export function deleteItem(id: string) {
  window.localStorage.setItem(KEY, JSON.stringify(read().filter((i) => i.id !== id)));
  window.dispatchEvent(new Event("awpa-saved-changed"));
}

export const kindLabel: Record<SavedKind, string> = {
  email: "Smart Email",
  planner: "Task Plan",
  research: "Research",
};
