import { data } from "react-router";
import { NoteForm } from "~/components/note-form";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { db } from "~/lib/db.server";
import { requireAuthSession } from "~/lib/session.server";
import type { Route } from "./+types/contact-notes";

export async function action({ request, params }: Route.ActionArgs) {
  const session = await requireAuthSession(request);

  const contact = await db.contact.findUnique({
    select: { id: true },
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
    case "create-note": {
      const content = String(formData.get("content"));

      await db.note.create({
        select: { id: true },
        data: { content, contact: { connect: { id: contact.id } } },
      });

      break;
    }
    // case "toggle-task-completion": {
    //   const todoId = String(formData.get("id"));
    //   const completed = String(formData.get("completed"));

    //   await updateTodo(userId, todoId, {
    //     completed: completed === "true",
    //     completedAt: completed === "true" ? new Date() : undefined,
    //   });

    //   break;
    // }
    // case "save-task": {
    //   const todoId = String(formData.get("id"));
    //   const description = String(formData.get("description"));

    //   await updateTodo(userId, todoId, {
    //     description,
    //   });

    //   break;
    // }
    // case "delete-task": {
    //   const id = String(formData.get("id"));

    //   await deleteTodo(userId, id);

    //   break;
    // }
    // case "clear-completed-tasks": {
    //   await clearCompletedTodos(userId);

    //   break;
    // }
    // case "delete-all-tasks": {
    //   await deleteAllTodos(userId);

    //   break;
    // }
    default: {
      throw data(`Invalid/Missing intent: ${intent}`, { status: 400 });
    }
  }

  return { ok: true };
}

export default function ContactNotes() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <NoteForm />
      </CardContent>
    </Card>
  );
}
