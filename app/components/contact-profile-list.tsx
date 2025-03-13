import type { Contact } from "@prisma/client";
import { format, formatDistanceStrict } from "date-fns";
import { PencilIcon } from "lucide-react";
import { Form, href, Link } from "react-router";
import { Button } from "./ui/button";
import { EmptyState } from "./ui/empty-state";

export function ContactProfileList({ contact }: { contact: Contact }) {
  const profile = {
    about: contact.about,
    email: contact.email,
    phone: contact.phone,
    linkedin: contact.linkedin,
    twitter: contact.twitter,
    website: contact.website,
    location: contact.location,
    company: contact.company,
    birthday: contact.birthday,
  };
  const isEmpty = Object.values(profile).every((value) => value === null);
  if (isEmpty) {
    return (
      <EmptyState
        title="Nurture your relationship"
        description="Get started by adding more details."
      >
        <Form
          action={href("/contacts/:contactId/edit", { contactId: contact.id })}
        >
          <Button type="submit">
            <PencilIcon aria-hidden />
            Edit details
          </Button>
        </Form>
      </EmptyState>
    );
  }

  return (
    <dl className="grid gap-3 text-sm">
      <div className="grid grid-cols-3">
        <dt className="text-muted-foreground">About</dt>
        <dd className="col-span-2">
          {contact.about ?? (
            <span className="text-muted-foreground/40">N/A</span>
          )}
        </dd>
      </div>
      <div className="grid grid-cols-3">
        <dt className="text-muted-foreground">Email</dt>
        <dd className="col-span-2">
          {contact.email ? (
            <Link to={`mailto:${contact.email}`}>{contact.email}</Link>
          ) : (
            <span className="text-muted-foreground/40">N/A</span>
          )}
        </dd>
      </div>
      <div className="grid grid-cols-3">
        <dt className="text-muted-foreground">Phone</dt>
        <dd className="col-span-2">
          {contact.phone ? (
            <Link to={`tel:${contact.phone}`}>{contact.phone}</Link>
          ) : (
            <span className="text-muted-foreground/40">N/A</span>
          )}
        </dd>
      </div>
      <div className="grid grid-cols-3">
        <dt className="text-muted-foreground">LinkedIn</dt>
        <dd className="col-span-2">
          {contact.linkedin ? (
            <Link to={contact.linkedin} target="_blank" rel="noreferrer">
              {contact.linkedin}
            </Link>
          ) : (
            <span className="text-muted-foreground/40">N/A</span>
          )}
        </dd>
      </div>
      <div className="grid grid-cols-3">
        <dt className="text-muted-foreground">Twitter</dt>
        <dd className="col-span-2">
          {contact.twitter ? (
            <Link
              to={`https://twitter.com/${contact.twitter}`}
              target="_blank"
              rel="noreferrer"
            >
              {contact.twitter}
            </Link>
          ) : (
            <span className="text-muted-foreground/40">N/A</span>
          )}
        </dd>
      </div>
      <div className="grid grid-cols-3">
        <dt className="text-muted-foreground">Website</dt>
        <dd className="col-span-2">
          {contact.website ? (
            <Link to={contact.website} target="_blank" rel="noreferrer">
              {contact.website}
            </Link>
          ) : (
            <span className="text-muted-foreground/40">N/A</span>
          )}
        </dd>
      </div>
      <div className="grid grid-cols-3">
        <dt className="text-muted-foreground">Location</dt>
        <dd className="col-span-2">
          {contact.location ?? (
            <span className="text-muted-foreground/40">N/A</span>
          )}
        </dd>
      </div>
      <div className="grid grid-cols-3">
        <dt className="text-muted-foreground">Company</dt>
        <dd className="col-span-2">
          {contact.company ?? (
            <span className="text-muted-foreground/40">N/A</span>
          )}
        </dd>
      </div>
      <div className="grid grid-cols-3">
        <dt className="text-muted-foreground">Birthday</dt>
        <dd className="col-span-2">
          {contact.birthday ? (
            `${format(contact.birthday, "MMMM d, yyyy")} (${formatDistanceStrict(
              contact.birthday,
              new Date(),
              { unit: "year" },
            )} old)`
          ) : (
            <span className="text-muted-foreground/40">N/A</span>
          )}
        </dd>
      </div>
    </dl>
  );
}
