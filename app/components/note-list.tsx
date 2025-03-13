import type { Note } from "@prisma/client";
import { compareDesc } from "date-fns";
import { useMemo } from "react";
import { useFetchers } from "react-router";
import { NoteItem } from "./note-item";
import { EmptyState } from "./ui/empty-state";

export function NoteList({ notes }: { notes: Note[] }) {
  const fetchers = useFetchers();
  const pendingDeleteNoteFetchers = fetchers.filter(
    (fetcher) => fetcher.formData?.get("intent") === "delete-note",
  );
  const deletingNoteIds = pendingDeleteNoteFetchers.map((fetcher) =>
    String(fetcher.formData?.get("noteId")),
  );

  const visibleNotes = useMemo(() => {
    const isDeletingNotes = deletingNoteIds.length !== 0;

    let filteredNotes = isDeletingNotes
      ? notes.filter((note) => !deletingNoteIds.includes(note.id))
      : notes;

    return filteredNotes.sort(
      (a, b) =>
        compareDesc(a.date, b.date) || compareDesc(a.createdAt, b.createdAt),
    );
  }, [notes, deletingNoteIds]);
  if (visibleNotes.length === 0) {
    return (
      <EmptyState
        title="No notes"
        description="You haven’t saved any notes yet."
      />
    );
  }

  return (
    <ul role="list" className="space-y-6">
      {visibleNotes.map((note) => (
        <li key={note.id} className="group relative flex gap-4">
          <div className="absolute top-0 -bottom-6 left-0 flex w-6 justify-center group-last:h-0">
            <div className="w-px bg-border" />
          </div>
          <div className="relative flex size-6 flex-none items-center justify-center bg-background">
            <div className="size-1.5 rounded-full bg-muted ring-1 ring-muted-foreground" />
          </div>
          <div className="flex-auto py-0.5">
            <NoteItem note={note} />
          </div>
        </li>
      ))}
    </ul>
  );
}
