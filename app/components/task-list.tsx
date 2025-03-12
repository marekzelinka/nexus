import type { Task } from "@prisma/client";
import { useMemo } from "react";
import { useFetchers, useSearchParams } from "react-router";
import type { View } from "~/lib/view-filter";
import { TaskItem } from "./task-item";
import { EmptyState } from "./ui/empty-state";

export function TaskList({ tasks }: { tasks: Task[] }) {
  const fetchers = useFetchers();

  const pendingDeleteTaskFetchers = fetchers.filter(
    (fetcher) =>
      fetcher.state !== "idle" &&
      fetcher.formData?.get("intent") === "delete-task",
  );
  const isDeletingTasks = pendingDeleteTaskFetchers.length !== 0;
  const deletingTaskIds = pendingDeleteTaskFetchers.map((fetcher) =>
    String(fetcher.formData?.get("taskId")),
  );

  const [searchParams] = useSearchParams();
  const view = (searchParams.get("view") ?? "all") as View;

  const visibleTasks = useMemo(() => {
    let filteredTasks = tasks.filter((task) =>
      view === "active"
        ? !task.completed
        : view === "completed"
          ? task.completed
          : true,
    );

    if (isDeletingTasks) {
      filteredTasks = filteredTasks.filter(
        (task) => !deletingTaskIds.includes(task.id),
      );
    }

    return filteredTasks;
  }, [tasks, isDeletingTasks, view, deletingTaskIds]);
  if (!visibleTasks.length) {
    return (
      <EmptyState
        title={
          view === "all"
            ? "No todos available"
            : view === "active"
              ? "No active todos"
              : "No completed todos"
        }
      />
    );
  }

  return (
    <ul role="list" className="space-y-4">
      {visibleTasks.map((task) => (
        <li key={task.id}>
          <TaskItem task={task} />
        </li>
      ))}
    </ul>
  );
}
