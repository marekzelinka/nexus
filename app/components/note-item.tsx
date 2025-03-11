import type { Note } from "@prisma/client";
import { EditIcon, TrashIcon } from "lucide-react";
import { useFetcher } from "react-router";
import { Button } from "./ui/button";

export function NoteItem({ note }: { note: Note }) {
  const fetcher = useFetcher();

  return (
    <li className="group relative flex gap-4">
      <div className="absolute top-0 -bottom-6 left-0 flex w-6 justify-center group-last:h-0">
        <div className="w-px bg-border" />
      </div>
      <div className="relative flex size-6 flex-none items-center justify-center bg-white">
        <div className="size-1.5 rounded-full bg-muted ring-1 ring-muted-foreground" />
      </div>
      <div className="-mt-3 flex-auto py-0.5">
        <div className="relative">
          <div className="relative overflow-hidden rounded-lg border bg-muted/40">
            <div className="p-3 text-base md:text-sm">{note.content}</div>
            {/* Spacer element to match the height of the toolbar */}
            <div className="py-2" aria-hidden>
              <div className="h-7" />
            </div>
          </div>
          <fetcher.Form
            method="post"
            className="absolute inset-x-0 bottom-0 flex gap-2 px-3 py-2 opacity-0 group-focus-within:opacity-100 group-hover:opacity-100"
          >
            <input type="hidden" name="noteId" value={note.id} />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="ml-auto size-7 text-muted-foreground"
            >
              <EditIcon aria-hidden />
              <span className="sr-only">Edit note</span>
            </Button>
            <Button
              type="submit"
              name="intent"
              value="delete-note"
              onClick={(event) => {
                const response = window.confirm(
                  "Are you sure you want to delete this note?",
                );
                if (!response) {
                  event.preventDefault();
                }
              }}
              variant="ghost"
              size="icon"
              className="size-7 text-muted-foreground"
            >
              <TrashIcon aria-hidden />
              <span className="sr-only">Delete note</span>
            </Button>
          </fetcher.Form>
        </div>
      </div>
    </li>
  );
}
