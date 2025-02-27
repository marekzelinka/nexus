import { PlusIcon } from "lucide-react";
import { Form, href } from "react-router";
import { Empty } from "~/components/empty";
import { Button } from "~/components/ui/button";

export default function SelectContact() {
  return (
    <Empty
      title="No contact selected"
      description="Select a contact on the left, or create a new contact."
    >
      <Form method="post" action={href("/contacts")}>
        <Button type="submit" size="sm" aria-label="New contact">
          <PlusIcon aria-hidden />
          New contact
        </Button>
      </Form>
    </Empty>
  );
}
