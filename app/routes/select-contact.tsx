import { PlusIcon } from "lucide-react";
import { Form, href } from "react-router";
import { Button } from "~/components/ui/button";
import { EmptyState } from "~/components/ui/empty-state";

export default function SelectContact() {
  return (
    <EmptyState
      title="No contact selected"
      description="Select a contact on the left, or create a new contact."
    >
      <Form method="post" action={href("/contacts")}>
        <Button type="submit" size="sm" aria-label="New contact">
          <PlusIcon aria-hidden />
          New contact
        </Button>
      </Form>
    </EmptyState>
  );
}
