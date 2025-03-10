import type { Note } from "@prisma/client";
import { format, isThisMinute, isToday, isYesterday } from "date-fns";
import { EllipsisIcon } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function NoteList({ notes }: { notes: Note[] }) {
  return (
    <ul role="list" className="space-y-4">
      {notes.map((note) => (
        <li key={note.id} className="flex items-start gap-4 text-sm">
          <div className="flex-1 py-1">{note.content}</div>
          <div className="flex flex-none items-center gap-2">
            <p className="text-muted-foreground">
              {isThisMinute(note.createdAt)
                ? "now"
                : isToday(note.createdAt)
                  ? "today"
                  : `${
                      isToday(note.createdAt)
                        ? "today, "
                        : isYesterday(note.createdAt)
                          ? "yesterday, "
                          : ""
                    } ${format(note.createdAt, "PP")}`}
            </p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-7"
                  aria-label="Toggle menu"
                >
                  <EllipsisIcon aria-hidden />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem variant="destructive">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </li>
      ))}
    </ul>
  );
}
