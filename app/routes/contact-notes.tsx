import { data } from "react-router";
import { AddNote } from "~/components/add-note";
import { NoteList } from "~/components/note-list";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { db } from "~/lib/db.server";
import { requireAuthSession } from "~/lib/session.server";
import type { Route } from "./+types/contact-notes";

export async function loader({ params }: Route.LoaderArgs) {
  const notes = await db.note.findMany({
    where: { contactId: params.contactId },
    orderBy: [{ createdAt: "desc" }],
  });

  return { notes };
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
    case "create-note": {
      const content = String(formData.get("content"));

      await db.note.create({
        data: { content, contact: { connect: { id: params.contactId } } },
      });

      break;
    }
    case "edit-note": {
      const noteId = String(formData.get("noteId"));
      const content = String(formData.get("content"));

      await db.note.update({
        data: { content },
        where: { id: noteId, contactId: params.contactId },
      });

      break;
    }
    case "delete-note": {
      const noteId = String(formData.get("noteId"));

      await db.note.delete({
        where: { id: noteId, contactId: params.contactId },
      });

      break;
    }
    default: {
      throw data(`Invalid/Missing intent: ${intent}`, { status: 400 });
    }
  }

  return { ok: true };
}

export default function ContactNotes({ loaderData }: Route.ComponentProps) {
  const { notes } = loaderData;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <AddNote />
          <NoteList notes={notes} />
        </div>
      </CardContent>
    </Card>
  );
}
