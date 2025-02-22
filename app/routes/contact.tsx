import { StarIcon } from "lucide-react";
import { Form } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Toggle } from "~/components/ui/toggle";
import { cn } from "~/lib/utils";
import type { Route } from "./+types/contact";

export const meta: Route.MetaFunction = () => [{ title: "Your Friend" }];

export default function Contact() {
  const contact = {
    id: "1",
    first: "Your",
    last: "Name",
    avatar: "https://placecats.com/200/200",
    twitter: "your_handle",
    notes: "Some notes",
    favorite: true,
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end gap-5">
        <div className="flex">
          <Avatar className="size-24">
            <AvatarImage src={contact.avatar} alt="" />
            <AvatarFallback
              name={
                contact.first || contact.last
                  ? `${contact.first} ${contact.last}`.trim()
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

function Favorite({ contact }: { contact: { favorite: boolean } }) {
  return (
    <Form method="post">
      <input
        type="hidden"
        name="favorite"
        value={contact.favorite ? "false" : "true"}
      />
      <Toggle
        type="submit"
        pressed={contact.favorite}
        variant="outline"
        size="sm"
      >
        <StarIcon className={cn(contact.favorite ? "fill-current" : "")} />
        <span className="sr-only">
          {contact.favorite ? "Remove from favorites" : "Add to favorites"}
        </span>
      </Toggle>
    </Form>
  );
}
