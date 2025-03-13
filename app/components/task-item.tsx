import type { Task } from "@prisma/client";
import { formatDistanceToNowStrict, isThisMinute } from "date-fns";
import {
  DotIcon,
  EditIcon,
  SaveIcon,
  SquareCheckIcon,
  SquareIcon,
  TrashIcon,
} from "lucide-react";
import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Form, useFetcher, useFetchers } from "react-router";
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

  const toogleCompletionFetcher = useFetcher();
  const isTogglingCompletion = toogleCompletionFetcher.state !== "idle";
  const optimisticCompleted = isTogglingCompletion
    ? toogleCompletionFetcher.formData?.get("completed") === "true"
    : task.completed;
  const optimisticCompletedAt =
    isTogglingCompletion || !optimisticCompleted
      ? new Date()
      : task.completedAt;

  const editFetcher = useFetcher();
  const isSavingEdits = editFetcher.state !== "idle";
  const optimisticDescription = isSavingEdits
    ? String(editFetcher.formData?.get("description"))
    : task.description;

  // Used to focus the edit button when we exit edit mode
  const editButtonRef = useRef<HTMLButtonElement>(null);

  // Used to focus the edit form input when we enter edit mode
  const editDescriptionInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-start gap-2">
      <toogleCompletionFetcher.Form method="post" className="flex-none">
        <input type="hidden" name="intent" value="toggle-task-completion" />
        <input type="hidden" name="taskId" value={task.id} />
        <input
          type="hidden"
          name="completed"
          value={optimisticCompleted ? "false" : "true"}
        />
        <Toggle
          type="submit"
          size="icon"
          pressed={optimisticCompleted}
          disabled={isEditing || isActionInProgress}
          aria-label={
            optimisticCompleted ? "Mark as incomplete" : "Mark as complete"
          }
          className="size-7"
        >
          {optimisticCompleted ? (
            <SquareCheckIcon aria-hidden />
          ) : (
            <SquareIcon aria-hidden />
          )}
        </Toggle>
      </toogleCompletionFetcher.Form>
      <div className="min-h-12 flex-auto">
        {isEditing ? (
          <editFetcher.Form
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
            <fieldset className="flex gap-2" disabled={isActionInProgress}>
              <Input
                ref={editDescriptionInputRef}
                name="description"
                required
                onBlur={(event) => {
                  if (
                    editDescriptionInputRef.current?.value !==
                      optimisticDescription &&
                    editDescriptionInputRef.current?.value.trim() !== ""
                  ) {
                    editFetcher.submit(event.currentTarget.form);
                  }

                  setIsEditing(false);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    flushSync(() => {
                      setIsEditing(false);
                    });

                    editButtonRef.current?.focus();
                  }
                }}
                defaultValue={optimisticDescription}
                aria-label="Edit task"
                className="h-7"
              />
              <Button
                type="submit"
                variant="outline"
                size="icon"
                aria-label="Save todo"
                className="size-7"
              >
                <SaveIcon aria-hidden />
              </Button>
            </fieldset>
          </editFetcher.Form>
        ) : (
          <div
            className={cn(
              "space-y-1.5 py-0.5",
              optimisticCompleted || isActionInProgress ? "opacity-50" : "",
            )}
          >
            <div className="text-sm/5">{optimisticDescription}</div>
            <div className="flex items-center gap-2 text-xs/5 text-muted-foreground">
              <p>
                Added{" "}
                <time dateTime={task.createdAt.toISOString()}>
                  {isThisMinute(task.createdAt)
                    ? "now"
                    : formatDistanceToNowStrict(task.createdAt, {
                        addSuffix: true,
                      })}
                </time>
              </p>
              {optimisticCompleted && optimisticCompletedAt ? (
                <>
                  <DotIcon aria-hidden className="size-1.5 text-foreground" />
                  <p>
                    Completed{" "}
                    <time dateTime={optimisticCompletedAt.toISOString()}>
                      {isThisMinute(optimisticCompletedAt)
                        ? "now"
                        : formatDistanceToNowStrict(optimisticCompletedAt, {
                            addSuffix: true,
                          })}
                    </time>
                  </p>
                </>
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
            variant="outline"
            size="icon"
            disabled={optimisticCompleted || isActionInProgress}
            onClick={() => {
              flushSync(() => {
                setIsEditing(true);
              });

              editDescriptionInputRef.current?.select();
            }}
            aria-label="Edit todo"
            className="size-7"
          >
            <EditIcon aria-hidden />
          </Button>
        ) : null}
        <Form method="post" navigate={false}>
          <input type="hidden" name="intent" value="delete-task" />
          <input type="hidden" name="taskId" value={task.id} />
          <Button
            type="submit"
            variant="outline"
            size="icon"
            disabled={optimisticCompleted || isEditing || isActionInProgress}
            onClick={(event) => {
              const response = window.confirm(
                "Are you sure you want to delete this task?",
              );
              if (!response) {
                event.preventDefault();
              }
            }}
            aria-label="Delete todo"
            className="size-7"
          >
            <TrashIcon aria-hidden />
          </Button>
        </Form>
      </div>
    </div>
  );
}
