import { href, redirect } from "react-router";
import { db } from "~/lib/db.server";
import { requireAuthSession } from "~/lib/session.server";
import type { Route } from "./+types/destroy-contact";

export async function action({ request, params }: Route.ActionArgs) {
  const session = await requireAuthSession(request);

  await db.contact.delete({
    select: { id: true },
    where: { id: params.contactId, userId: session.user.id },
  });

  return redirect(href("/contacts"));
}
