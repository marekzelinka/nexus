import type { Note } from "@prisma/client";
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

    return filteredNotes;
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
    <ul role="list" className="space-y-8 pt-3">
      {visibleNotes.map((note) => (
        <NoteItem key={note.id} note={note} />
      ))}
    </ul>
  );
}
