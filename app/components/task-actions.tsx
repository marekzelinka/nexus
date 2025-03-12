import type { Task } from "@prisma/client";
import { DeleteIcon, ListRestartIcon } from "lucide-react";
import { useFetcher, useFetchers } from "react-router";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export function TaskActions({ tasks }: { tasks: Task[] }) {
  const fetchers = useFetchers();

  const pendingToggleCompletionFetchers = fetchers.filter(
    (fetcher) =>
      fetcher.state !== "idle" &&
      fetcher.formData?.get("intent") === "toggle-task-completion",
  );
  const isTogglingCompletion = pendingToggleCompletionFetchers.length > 0;
  const completingTodos = pendingToggleCompletionFetchers.map((fetcher) => ({
    id: String(fetcher.formData?.get("id")),
    completed: fetcher.formData?.get("completed") === "true",
  }));

  const pendingDeleteFetchers = fetchers.filter(
    (fetcher) =>
      fetcher.state !== "idle" &&
      fetcher.formData?.get("intent") === "delete-task",
  );
  const isDeleting = pendingDeleteFetchers.length > 0;
  const deletingTodoIds = pendingDeleteFetchers.map((fetcher) =>
    String(fetcher.formData?.get("id")),
  );

  tasks = isTogglingCompletion
    ? tasks.map((task) => {
        const completingTodo = completingTodos.find(
          (todo) => todo.id === task.id,
        );
        if (completingTodo) {
          task.completed = completingTodo.completed;
        }

        return task;
      })
    : tasks;

  tasks = isDeleting
    ? tasks.filter((task) => !deletingTodoIds.includes(task.id))
    : tasks;

  const activeTaskCount = tasks.filter((task) => !task.completed).length;

  const fetcher = useFetcher();

  const isClearingCompleted =
    fetcher.state !== "idle" &&
    fetcher.formData?.get("intent") === "clear-completed-tasks";

  const isDeletingAll =
    fetcher.state !== "idle" &&
    fetcher.formData?.get("intent") === "delete-all-tasks";

  return (
    <div className="flex items-center justify-between gap-6">
      <p className="text-sm">
        {activeTaskCount} {activeTaskCount === 1 ? "item" : "items"} left
      </p>
      <fetcher.Form method="post" className="flex gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="submit"
              name="intent"
              value="clear-completed-tasks"
              onClick={(event) => {
                const response = window.confirm(
                  "Are you sure you want to clear all completed tasks?",
                );
                if (!response) {
                  event.preventDefault();
                }
              }}
              disabled={
                !tasks.some((todo) => todo.completed) || isClearingCompleted
              }
              variant="destructive"
              size="icon"
              className="size-7"
              // className="text-red-400 transition hover:text-red-600 disabled:pointer-events-none disabled:opacity-50"
            >
              <ListRestartIcon aria-hidden />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isClearingCompleted ? "Clearing…" : "Clear Completed"}</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="submit"
              name="intent"
              value="delete-all-tasks"
              onClick={(event) => {
                const response = window.confirm(
                  "Are you sure you want to delete all tasks?",
                );
                if (!response) {
                  event.preventDefault();
                }
              }}
              disabled={!tasks.length || isDeletingAll}
              variant="destructive"
              size="icon"
              className="size-7"
              // className="text-red-400 transition hover:text-red-600 disabled:pointer-events-none disabled:opacity-50"
            >
              <DeleteIcon aria-hidden />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isDeletingAll ? "Deleting…" : "Delete All"}</p>
          </TooltipContent>
        </Tooltip>
      </fetcher.Form>
    </div>
  );
}
