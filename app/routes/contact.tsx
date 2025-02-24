import type { Contact } from "@prisma/client";
import { StarIcon } from "lucide-react";
import { data, Form } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Toggle } from "~/components/ui/toggle";
import { db } from "~/lib/db.server";
import { requireAuthSession } from "~/lib/session.server";
import type { Route } from "./+types/contact";

export const meta: Route.MetaFunction = ({ data, error }) => [
  {
    title: error
      ? "No contact found"
      : data.contact.first || data.contact.last
        ? `${data.contact.first ?? ""} ${data.contact.last ?? ""}`.trim()
        : "No Name",
  },
];

export async function loader({ request, params }: Route.LoaderArgs) {
  const session = await requireAuthSession(request);

  const contact = await db.contact.findUnique({
    select: { id: true, first: true, last: true, avatar: true, favorite: true },
    where: { id: params.contactId, userId: session.user.id },
  });
  if (!contact) {
    throw data("No contact found", { status: 404 });
  }

  return { contact };
}

export default function Contact({ loaderData }: Route.ComponentProps) {
  const { contact } = loaderData;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end gap-5">
        <div className="flex">
          <Avatar className="size-24">
            <AvatarImage src={contact.avatar ?? undefined} alt="" />
            <AvatarFallback
              name={
                contact.first || contact.last
                  ? `${contact.first ?? ""} ${contact.last ?? ""}`.trim()
                  : undefined
              }
              className="text-3xl [&_svg]:size-14"
            />
          </Avatar>
        </div>
        <div className="mt-6 flex min-w-0 flex-1 items-center justify-end gap-6 pb-1">
          <div className="mt-6 flex min-w-0 flex-1 gap-3">
            <h1 className="truncate text-2xl font-bold">
              {contact.first || contact.last ? (
                <>
                  {contact.first} {contact.last}
                </>
              ) : (
                "No Name"
              )}
            </h1>
            <Favorite contact={contact} />
          </div>
          <div className="mt-6 flex flex-row justify-stretch gap-4"></div>
        </div>
      </div>
    </div>
  );
}

function Favorite({ contact }: { contact: Pick<Contact, "favorite"> }) {
  return (
    <Form method="post">
      <input
        type="hidden"
        name="favorite"
        value={contact.favorite ? "false" : "true"}
      />
      <Toggle
        type="submit"
        pressed={contact.favorite ?? undefined}
        variant="outline"
        size="sm"
      >
        <StarIcon aria-hidden />
        <span className="sr-only">
          {contact.favorite ? "Remove from favorites" : "Add to favorites"}
        </span>
      </Toggle>
    </Form>
  );
}
