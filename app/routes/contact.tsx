import type { Contact } from "@prisma/client";
import { PencilIcon, StarIcon, TrashIcon } from "lucide-react";
import { data, Form, href, NavLink, Outlet, useFetcher } from "react-router";
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
  const favorite = formData.get("favorite");

  const updated = await db.contact.update({
    data: { favorite: favorite === "true" },
    where: { id: params.contactId, userId: session.user.id },
  });

  return { contact: updated };
}

export function ErrorBoundary() {
  return <GenericErrorBoundary />;
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
          <div className="mt-6 flex flex-row justify-stretch gap-4">
            <Form
              action={href("/contacts/:contactId/edit", {
                contactId: contact.id,
              })}
            >
              <Button type="submit" variant="outline" size="sm">
                <PencilIcon aria-hidden />
                Edit
              </Button>
            </Form>
            <Form
              method="post"
              action={href("/contacts/:contactId/destroy", {
                contactId: contact.id,
              })}
              onSubmit={(event) => {
                const response = confirm(
                  "Please confirm you want to delete this record.",
                );
                if (!response) {
                  event.preventDefault();
                }
              }}
            >
              <Button type="submit" variant="outline" size="sm">
                <TrashIcon aria-hidden />
                Delete
              </Button>
            </Form>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <nav
          aria-label="Tabs"
          className="inline-flex h-9 w-fit items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground"
        >
          {[
            { name: "About", href: "." },
            { name: "Notes", href: "notes" },
            { name: "Tasks", href: "tasks" },
          ].map((tab) => (
            <NavLink
              key={tab.name}
              to={tab.href}
              prefetch="intent"
              end={tab.href === "."}
              className="flex-1 rounded-md px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring aria-[current=page]:bg-background aria-[current=page]:text-foreground aria-[current=page]:shadow-sm"
            >
              {tab.name}
            </NavLink>
          ))}
        </nav>
        <Outlet />
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
      <input
        type="hidden"
        name="favorite"
        value={contact.favorite ? "false" : "true"}
      />
      <Toggle
        type="submit"
        name="intent"
        value="favoriteContact"
        pressed={favorite}
        variant="outline"
        size="sm"
      >
        <StarIcon aria-hidden className={cn(favorite ? "fill-current" : "")} />
        <span className="sr-only">
          {favorite ? "Remove from favorites" : "Add to favorites"}
        </span>
      </Toggle>
    </fetcher.Form>
  );
}
