import { useOutletContext } from "react-router";
import { ContactProfileList } from "~/components/contact-profile-list";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import type { Route } from "./+types/contact-profile";
import type { ContactOutletContext } from "./contact";

export default function ContactProfile({}: Route.ComponentProps) {
  const { contact } = useOutletContext() as ContactOutletContext;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <ContactProfileList contact={contact} />
      </CardContent>
    </Card>
  );
}
