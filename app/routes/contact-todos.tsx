import { data } from "react-router";
import { AddTask } from "~/components/add-task";
import { TaskActions } from "~/components/task-actions";
import { TaskList } from "~/components/task-list";
import { TaskViewFilter } from "~/components/task-view-filter";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { EmptyState } from "~/components/ui/empty-state";
import { db } from "~/lib/db.server";
import { requireAuthSession } from "~/lib/session.server";
import type { Route } from "./+types/contact-todos";

export async function loader({ params }: Route.LoaderArgs) {
  const tasks = await db.task.findMany({
    where: { contactId: params.contactId },
    orderBy: [{ createdAt: "desc" }],
  });

  return { tasks };
}

export async function action({ request, params }: Route.ActionArgs) {
  const session = await requireAuthSession(request);

  const contact = await db.contact.findUnique({
    where: { id: params.contactId, userId: session.user.id },
  });
  if (!contact) {
    throw data(`No user with the username "${params.contactId}" exists`, {
      status: 404,
    });
  }

  const formData = await request.formData();

  const intent = formData.get("intent");
  switch (intent) {
    case "create-task": {
      const description = String(formData.get("description"));

      await db.task.create({
        data: { description, contact: { connect: { id: params.contactId } } },
      });

      break;
    }
    case "toggle-task-completion": {
      const taskId = String(formData.get("taskId"));
      const completed = String(formData.get("completed"));

      await db.task.update({
        data: {
          completed: completed === "true",
          completedAt: completed === "true" ? new Date() : undefined,
        },
        where: { id: taskId, contactId: params.contactId },
      });

      break;
    }
    case "edit-task": {
      const taskId = String(formData.get("taskId"));
      const description = String(formData.get("description"));

      await db.task.update({
        data: {
          description,
        },
        where: { id: taskId, contactId: params.contactId },
      });

      break;
    }
    case "delete-task": {
      const taskId = String(formData.get("taskId"));

      await db.task.delete({
        where: { id: taskId, contactId: params.contactId },
      });

      break;
    }
    case "clear-completed-tasks": {
      await db.task.deleteMany({
        where: { completed: true, contactId: params.contactId },
      });

      break;
    }
    case "delete-all-tasks": {
      await db.task.deleteMany({ where: { contactId: params.contactId } });

      break;
    }
    default: {
      throw data(`Invalid/Missing intent: ${intent}`, { status: 400 });
    }
  }

  return { ok: true };
}

export default function ContactTodos({ loaderData }: Route.ComponentProps) {
  const { tasks } = loaderData;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Todos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <AddTask />
          <TaskViewFilter />
          {tasks.length ? (
            <TaskList tasks={tasks} />
          ) : (
            <EmptyState
              title="No todos available"
              description="You haven’t added any todos yet."
            />
          )}
          <TaskActions tasks={tasks} />
        </div>
      </CardContent>
    </Card>
  );
}
