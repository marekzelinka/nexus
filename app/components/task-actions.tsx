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
    id: String(fetcher.formData?.get("taskId")),
    completed: fetcher.formData?.get("completed") === "true",
  }));
  const pendingDeleteFetchers = fetchers.filter(
    (fetcher) =>
      fetcher.state !== "idle" &&
      fetcher.formData?.get("intent") === "delete-task",
  );
  const isDeleting = pendingDeleteFetchers.length > 0;
  const deletingTodoIds = pendingDeleteFetchers.map((fetcher) =>
    String(fetcher.formData?.get("taskId")),
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

  const clearCompletedFetcher = useFetcher();
  const isClearingCompleted = clearCompletedFetcher.state !== "idle";

  const deleteAllFetcher = useFetcher();
  const isDeletingAll = deleteAllFetcher.state !== "idle";

  return (
    <div className="flex items-center justify-between gap-6">
      <p className="text-sm text-muted-foreground">
        {activeTaskCount} {activeTaskCount === 1 ? "item" : "items"} left
      </p>
      <div className="flex gap-2">
        <clearCompletedFetcher.Form method="post">
          <input type="hidden" name="intent" value="clear-completed-tasks" />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="submit"
                variant="destructive"
                size="icon"
                disabled={
                  !tasks.some((todo) => todo.completed) || isClearingCompleted
                }
                onClick={(event) => {
                  const response = window.confirm(
                    "Are you sure you want to clear all completed tasks?",
                  );
                  if (!response) {
                    event.preventDefault();
                  }
                }}
                className="size-7"
              >
                <ListRestartIcon aria-hidden />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isClearingCompleted ? "Clearing…" : "Clear Completed"}</p>
            </TooltipContent>
          </Tooltip>
        </clearCompletedFetcher.Form>
        <deleteAllFetcher.Form>
          <input type="hidden" name="intent" value="delete-all-tasks" />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="submit"
                variant="destructive"
                size="icon"
                disabled={!tasks.length || isDeletingAll}
                onClick={(event) => {
                  const response = window.confirm(
                    "Are you sure you want to delete all tasks?",
                  );
                  if (!response) {
                    event.preventDefault();
                  }
                }}
                className="size-7"
              >
                <DeleteIcon aria-hidden />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isDeletingAll ? "Deleting…" : "Delete All"}</p>
            </TooltipContent>
          </Tooltip>
        </deleteAllFetcher.Form>
      </div>
    </div>
  );
}
