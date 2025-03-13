import { Form, useSearchParams } from "react-router";
import type { View } from "~/lib/view-filter";
import { Toggle } from "./ui/toggle";

export function TaskViewFilter() {
  const [searchParams] = useSearchParams();
  const view = (searchParams.get("view") ?? "all") as View;

  return (
    <Form aria-label="Filter by view" className="flex gap-2">
      <Toggle
        type="submit"
        name="view"
        value="all"
        size="sm"
        pressed={view === "all"}
        aria-label="View all todos"
      >
        All
      </Toggle>
      <Toggle
        type="submit"
        name="view"
        value="active"
        size="sm"
        pressed={view === "active"}
        aria-label="View active todos"
      >
        Active
      </Toggle>
      <Toggle
        type="submit"
        name="view"
        value="completed"
        size="sm"
        pressed={view === "completed"}
        aria-label="View completed todos"
      >
        Completed
      </Toggle>
    </Form>
  );
}
