import type { Note } from "@prisma/client";
import {
  format,
  formatDistanceToNowStrict,
  isEqual,
  isThisMinute,
} from "date-fns";
import { DotIcon, EditIcon, TrashIcon } from "lucide-react";
import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Form, useFetcher } from "react-router";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

export function NoteItem({ note }: { note: Note }) {
  const [isEditing, setIsEditing] = useState(false);

  const editFetcher = useFetcher();
  const isSavingEdits =
    editFetcher.state !== "idle" &&
    editFetcher.formData?.get("intent") === "edit-note";
  const optimisticContent = isSavingEdits
    ? String(editFetcher.formData?.get("content"))
    : note.content;

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2 text-xs/5 text-muted-foreground">
        <p>
          Added{" "}
          <time dateTime={note.date.toISOString()}>
            {isThisMinute(note.date)
              ? "now"
              : formatDistanceToNowStrict(note.date, {
                  addSuffix: true,
                })}
          </time>
        </p>
        {!isEqual(note.date, note.updatedAt) ? (
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
        <editFetcher.Form method="post">
          <input type="hidden" name="intent" value="edit-note" />
          <input type="hidden" name="noteId" value={note.id} />
          <fieldset className="relative">
            <div className="rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring">
              <Textarea
                ref={textareaRef}
                name="content"
                id="content"
                required
                aria-label="Content"
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

                    editFetcher.submit(event.currentTarget.form);

                    flushSync(() => {
                      setIsEditing(false);
                    });

                    editButtonRef.current?.focus();
                  }
                }}
                onBlur={(event) => {
                  if (
                    textareaRef.current?.value !== optimisticContent &&
                    textareaRef.current?.value.trim() !== ""
                  ) {
                    editFetcher.submit(event.currentTarget.form);
                  }

                  setIsEditing(false);
                }}
                className="resize-none border-0 p-3 shadow-none focus-visible:ring-0"
              />
              {/* Spacer element to match the height of the toolbar */}
              <div className="py-2" aria-hidden>
                <div className="h-9" />
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 px-3 py-2">
              <Input
                type="date"
                name="date"
                id="date"
                required
                defaultValue={format(note.date, "yyyy-MM-dd")}
                aria-label="Date"
                className="w-fit"
              />
              <Button type="submit" variant="secondary" className="ml-auto">
                {isSavingEdits ? "Saving…" : "Save"}
              </Button>
            </div>
          </fieldset>
        </editFetcher.Form>
      ) : (
        <div className="relative">
          <div className="rounded-lg border bg-muted/40">
            <div className="p-3 text-sm">{optimisticContent}</div>
            {/* Spacer element to match the height of the toolbar */}
            <div className="py-2" aria-hidden>
              <div className="h-7" />
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 px-3 py-2 opacity-0 group-focus-within:opacity-100 group-hover:opacity-100">
            <Button
              ref={editButtonRef}
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => {
                flushSync(() => {
                  setIsEditing(true);
                });

                textareaRef.current?.select();
              }}
              aria-label="Edit note"
              className="ml-auto size-7"
            >
              <EditIcon aria-hidden />
            </Button>
            <Form
              method="post"
              navigate={false}
              onSubmit={(event) => {
                const response = window.confirm(
                  "Are you sure you want to delete this note?",
                );
                if (!response) {
                  event.preventDefault();
                }
              }}
            >
              <input type="hidden" name="intent" value="delete-note" />
              <input type="hidden" name="noteId" value={note.id} />
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                aria-label="Delete note"
                className="size-7"
              >
                <TrashIcon aria-hidden />
              </Button>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
}
