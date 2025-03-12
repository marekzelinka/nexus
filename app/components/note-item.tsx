import type { Note } from "@prisma/client";
import { formatDistanceToNowStrict, isEqual, isThisMinute } from "date-fns";
import { CheckIcon, DotIcon, EditIcon, TrashIcon } from "lucide-react";
import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useFetcher } from "react-router";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

export function NoteItem({ note }: { note: Note }) {
  const [isEditing, setIsEditing] = useState(false);

  let content = note.content;

  const fetcher = useFetcher();
  const isSavingEdits = fetcher.formData?.get("intent") === "edit-note";
  if (isSavingEdits) {
    content = String(fetcher.formData?.get("content"));
  }

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <li className="group relative flex gap-4">
      <div className="absolute top-0 -bottom-6 left-0 flex w-6 justify-center group-last:h-0">
        <div className="w-px bg-border" />
      </div>
      <div className="flex size-6 flex-none items-center justify-center bg-background">
        <div className="size-1.5 rounded-full bg-muted ring-1 ring-muted-foreground" />
      </div>
      <div className="flex-auto space-y-1.5 py-1">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <p>
            Added{" "}
            <time dateTime={note.createdAt.toISOString()}>
              {isThisMinute(note.createdAt)
                ? "now"
                : formatDistanceToNowStrict(note.createdAt, {
                    addSuffix: true,
                  })}
            </time>
          </p>
          {!isEqual(note.createdAt, note.updatedAt) ? (
            <>
              <DotIcon aria-hidden className="size-1.5 text-foreground" />
              <p>
                Updated{" "}
                <time dateTime={note.updatedAt.toISOString()}>
                  {isThisMinute(note.updatedAt)
                    ? "now"
                    : formatDistanceToNowStrict(note.updatedAt, {
                        addSuffix: true,
                      })}
                </time>
              </p>
            </>
          ) : null}
        </div>
        {isEditing ? (
          <fetcher.Form method="post">
            <input type="hidden" name="intent" value="edit-note" />
            <input type="hidden" name="noteId" value={note.id} />
            <fieldset className="relative">
              <div className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring">
                <Label htmlFor="content" className="sr-only">
                  Note
                </Label>
                <Textarea
                  ref={textareaRef}
                  name="content"
                  id="content"
                  required
                  defaultValue={note.content}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") {
                      flushSync(() => {
                        setIsEditing(false);
                      });

                      editButtonRef.current?.focus();
                    }

                    if (event.key === "Enter") {
                      event.preventDefault();

                      fetcher.submit(event.currentTarget.form);

                      flushSync(() => {
                        setIsEditing(false);
                      });

                      editButtonRef.current?.focus();
                    }
                  }}
                  onBlur={(event) => {
                    if (
                      textareaRef.current?.value !== content &&
                      textareaRef.current?.value.trim() !== ""
                    ) {
                      fetcher.submit(event.currentTarget.form);
                    }

                    setIsEditing(false);
                  }}
                  className="resize-none border-0 p-3 shadow-none focus-visible:ring-0"
                />
                {/* Spacer element to match the height of the toolbar */}
                <div className="py-2" aria-hidden>
                  <div className="h-7" />
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 flex px-3 py-2">
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  className="ml-auto size-7"
                >
                  <CheckIcon aria-hidden />
                  <span className="sr-only">Save note</span>
                </Button>
              </div>
            </fieldset>
          </fetcher.Form>
        ) : (
          <div className="relative">
            <div className="relative overflow-hidden rounded-lg border bg-muted/40">
              <div className="p-3 text-sm">{content}</div>
              {/* Spacer element to match the height of the toolbar */}
              <div className="py-2" aria-hidden>
                <div className="h-7" />
              </div>
            </div>
            <fetcher.Form
              method="post"
              className="absolute inset-x-0 bottom-0 flex justify-end gap-2 px-3 py-2 opacity-0 group-focus-within:opacity-100 group-hover:opacity-100"
            >
              <input type="hidden" name="noteId" value={note.id} />
              <Button
                ref={editButtonRef}
                type="button"
                onClick={() => {
                  flushSync(() => {
                    setIsEditing(true);
                  });
                  textareaRef.current?.select();
                }}
                variant="ghost"
                size="icon"
                className="size-7"
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
                className="size-7"
              >
                <TrashIcon aria-hidden />
                <span className="sr-only">Delete note</span>
              </Button>
            </fetcher.Form>
          </div>
        )}
      </div>
    </li>
  );
}
