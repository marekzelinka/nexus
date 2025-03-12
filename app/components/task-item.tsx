import type { Task } from "@prisma/client";
import { format } from "date-fns";
import {
  CalendarCheckIcon,
  CalendarPlus2Icon,
  EditIcon,
  SaveIcon,
  SquareCheckIcon,
  SquareIcon,
  TrashIcon,
} from "lucide-react";
import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useFetcher, useFetchers } from "react-router";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Toggle } from "./ui/toggle";

export function TaskItem({ task }: { task: Task }) {
  const [isEditing, setIsEditing] = useState(false);

  const fetchers = useFetchers();
  const isClearingCompleted = fetchers.some(
    (fetcher) =>
      fetcher.state !== "idle" &&
      fetcher.formData?.get("intent") === "clear-completed-tasks",
  );
  const isDeletingAll = fetchers.some(
    (fetcher) =>
      fetcher.state !== "idle" &&
      fetcher.formData?.get("intent") === "delete-all-tasks",
  );

  const isActionInProgress =
    isDeletingAll || (task.completed && isClearingCompleted);

  const fetcher = useFetcher();
  const isTogglingCompletion =
    fetcher.state !== "idle" &&
    fetcher.formData?.get("intent") === "toggle-task-completion";
  const isSavingEdits =
    fetcher.state !== "idle" && fetcher.formData?.get("intent") === "edit-task";

  const optimisticTask = {
    description: isSavingEdits
      ? String(fetcher.formData?.get("description"))
      : task.description,
    completed: isTogglingCompletion
      ? fetcher.formData?.get("completed") === "true"
      : task.completed,
    completedAt:
      isTogglingCompletion || !task.completedAt ? new Date() : task.completedAt,
  };

  // Used to focus the edit button when we exit edit mode
  const editButtonRef = useRef<HTMLButtonElement>(null);
  // Used to focus the edit form input when we enter edit mode
  const editDescriptionInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-start gap-2">
      <fetcher.Form method="post" className="flex-none">
        <input type="hidden" name="intent" value="toggle-task-completion" />
        <input type="hidden" name="taskId" value={task.id} />
        <input
          type="hidden"
          name="completed"
          value={optimisticTask.completed ? "false" : "true"}
        />
        <Toggle
          type="submit"
          disabled={isEditing || isActionInProgress}
          pressed={optimisticTask.completed}
          size="icon"
          className="size-7"
        >
          {optimisticTask.completed ? (
            <>
              <SquareCheckIcon />
              <span className="sr-only">Mark as incomplete</span>
            </>
          ) : (
            <>
              <SquareIcon />
              <span className="sr-only">Mark as complete</span>
            </>
          )}
        </Toggle>
      </fetcher.Form>
      <div className="min-h-12 flex-auto">
        {isEditing ? (
          <fetcher.Form
            method="post"
            onSubmit={() => {
              flushSync(() => {
                setIsEditing(false);
              });

              editButtonRef.current?.focus();
            }}
          >
            <input type="hidden" name="intent" value="edit-task" />
            <input type="hidden" name="taskId" value={task.id} />
            <fieldset className="flex gap-2">
              <Input
                ref={editDescriptionInputRef}
                name="description"
                required
                onBlur={(event) => {
                  // Cancel edit mode when we click outside the input
                  if (!event.currentTarget.contains(event.relatedTarget)) {
                    setIsEditing(false);
                  }
                }}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    flushSync(() => {
                      setIsEditing(false);
                    });

                    editButtonRef.current?.focus();
                  }
                }}
                defaultValue={optimisticTask.description}
                aria-label="Edit task"
                className="h-7"
              />
              <Button
                type="submit"
                disabled={isActionInProgress}
                variant="outline"
                size="icon"
                className="size-7"
              >
                <SaveIcon aria-hidden />
                <span className="sr-only">Save todo</span>
              </Button>
            </fieldset>
          </fetcher.Form>
        ) : (
          <div
            className={cn(
              "space-y-1 py-1",
              optimisticTask.completed || isActionInProgress
                ? "opacity-50"
                : "",
            )}
          >
            <div className="text-sm">{task.description}</div>
            <div className="flex gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <CalendarPlus2Icon aria-hidden className="size-4" />
                <time dateTime={task.createdAt.toISOString()}>
                  {format(task.createdAt, "PPp")}
                </time>
              </div>
              {optimisticTask.completed ? (
                <div className="flex items-center gap-1.5">
                  <CalendarCheckIcon aria-hidden className="size-4" />
                  <time dateTime={optimisticTask.completedAt.toISOString()}>
                    {format(optimisticTask.completedAt, "PPp")}
                  </time>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-none gap-2">
        {!isEditing ? (
          <Button
            ref={editButtonRef}
            type="button"
            onClick={() => {
              flushSync(() => {
                setIsEditing(true);
              });

              editDescriptionInputRef.current?.select();
            }}
            disabled={optimisticTask.completed || isActionInProgress}
            variant="outline"
            size="icon"
            className="size-7"
          >
            <EditIcon aria-hidden />
            <span className="sr-only">Edit</span>
          </Button>
        ) : null}
        <fetcher.Form method="post">
          <input type="hidden" name="intent" value="delete-task" />
          <input type="hidden" name="taskId" value={task.id} />
          <Button
            type="submit"
            onClick={(event) => {
              const response = window.confirm(
                "Are you sure you want to delete this task?",
              );
              if (!response) {
                event.preventDefault();
              }
            }}
            disabled={
              optimisticTask.completed || isEditing || isActionInProgress
            }
            variant="outline"
            size="icon"
            className="size-7"
          >
            <TrashIcon aria-hidden />
            <span className="sr-only">Delete</span>
          </Button>
        </fetcher.Form>
      </div>
    </div>
  );
}
