import { Form, useSearchParams } from "react-router";
import type { View } from "~/lib/view-filter";
import { Toggle } from "./ui/toggle";

export function TaskViewFilter() {
  const [searchParams] = useSearchParams();
  const view = (searchParams.get("view") ?? "all") as View;

  return (
    <Form>
      <nav aria-label="Task filter" className="flex gap-2">
        <Toggle
          type="submit"
          name="view"
          value="all"
          aria-label="View all"
          size="sm"
          pressed={view === "all"}
        >
          All
        </Toggle>
        <Toggle
          type="submit"
          name="view"
          value="active"
          aria-label="View active"
          size="sm"
          pressed={view === "active"}
        >
          Active
        </Toggle>
        <Toggle
          type="submit"
          name="view"
          value="completed"
          aria-label="View completed"
          size="sm"
          pressed={view === "completed"}
        >
          Completed
        </Toggle>
      </nav>
    </Form>
  );
}
