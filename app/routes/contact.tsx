import type { Contact } from "@prisma/client";
import { EditIcon, StarIcon, TrashIcon } from "lucide-react";
import {
  data,
  Form,
  href,
  NavLink,
  Outlet,
  redirect,
  useFetcher,
} from "react-router";
import { GenericErrorBoundary } from "~/components/error-boundary";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Toggle } from "~/components/ui/toggle";
import { db } from "~/lib/db.server";
import { requireAuthSession } from "~/lib/session.server";
import { cn } from "~/lib/utils";
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
    where: { id: params.contactId, userId: session.user.id },
  });
  if (!contact) {
    throw data(`No user with the username "${params.contactId}" exists`, {
      status: 404,
    });
  }

  return { contact };
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
    case "favorite-contact": {
      const favorite = formData.get("favorite");

      await db.contact.update({
        data: { favorite: favorite === "true" },
        where: { id: params.contactId, userId: session.user.id },
      });

      break;
    }
    case "delete-contact": {
      await db.contact.delete({
        where: { id: params.contactId, userId: session.user.id },
      });

      return redirect(href("/contacts"));
    }
    default: {
      throw data(`Invalid/Missing intent: ${intent}`, { status: 400 });
    }
  }

  return { ok: true };
}

export function ErrorBoundary() {
  return <GenericErrorBoundary />;
}

export type ContactOutletContext = { contact: Contact };

export default function Contact({ loaderData }: Route.ComponentProps) {
  const { contact } = loaderData;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end gap-5">
        <Avatar className="size-24 flex-none">
          <AvatarImage src={contact.avatar ?? undefined} alt="" />
          <AvatarFallback
            name={
              contact.first || contact.last
                ? `${contact.first ?? ""} ${contact.last ?? ""}`.trim()
                : undefined
            }
            className="text-3xl [&_svg]:size-12"
          />
        </Avatar>
        <div className="flex min-w-0 flex-1 items-center gap-6 pb-1">
          <h1
            className={cn(
              "min-w-0 flex-1 truncate text-2xl font-bold",
              contact.first || contact.last ? "" : "text-muted-foreground/50",
            )}
          >
            {contact.first || contact.last ? (
              <>
                {contact.first} {contact.last}
              </>
            ) : (
              "No Name"
            )}
          </h1>
          <div className="flex gap-4">
            <Favorite contact={contact} />
            <Form
              action={href("/contacts/:contactId/edit", {
                contactId: contact.id,
              })}
            >
              <Button type="submit" variant="outline">
                <EditIcon aria-hidden />
                Edit
              </Button>
            </Form>
            <Form
              method="post"
              onSubmit={(event) => {
                const response = confirm(
                  "Please confirm you want to delete this record.",
                );
                if (!response) {
                  event.preventDefault();
                }
              }}
            >
              <input type="hidden" name="intent" value="delete-contact" />
              <Button type="submit" variant="outline">
                <TrashIcon aria-hidden />
                Delete
              </Button>
            </Form>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <nav
          aria-label="Tabs"
          className="flex h-9 w-fit items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground"
        >
          {[
            {
              name: "Profile",
              href: href("/contacts/:contactId", { contactId: contact.id }),
            },
            {
              name: "Notes",
              href: href("/contacts/:contactId/notes", {
                contactId: contact.id,
              }),
            },
            {
              name: "Todos",
              href: href("/contacts/:contactId/todos", {
                contactId: contact.id,
              }),
            },
          ].map((tab) => (
            <NavLink
              key={tab.name}
              to={tab.href}
              prefetch="intent"
              end
              className="flex-1 rounded-md px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring aria-[current=page]:bg-background aria-[current=page]:text-foreground aria-[current=page]:shadow-sm"
            >
              {tab.name}
            </NavLink>
          ))}
        </nav>
        <Outlet context={{ contact } satisfies ContactOutletContext} />
      </div>
    </div>
  );
}

function Favorite({ contact }: { contact: Pick<Contact, "id" | "favorite"> }) {
  const fetcher = useFetcher({ key: `contact:${contact.id}` });
  const favorite = fetcher.formData
    ? fetcher.formData.get("favorite") === "true"
    : Boolean(contact.favorite);

  return (
    <fetcher.Form method="post">
      <input type="hidden" name="intent" value="favorite-contact" />
      <input
        type="hidden"
        name="favorite"
        value={favorite ? "false" : "true"}
      />
      <Toggle
        type="submit"
        variant="outline"
        pressed={favorite}
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
      >
        <StarIcon aria-hidden />
      </Toggle>
    </fetcher.Form>
  );
}
