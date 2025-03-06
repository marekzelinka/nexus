import { HexagonIcon } from "lucide-react";
import { href, Link } from "react-router";
import { Button } from "~/components/ui/button";
import { useOptionalUser } from "~/hooks/use-user";
import type { Route } from "./+types/landing";

export const meta: Route.MetaFunction = () => [
  { title: "Nexus" },
  {
    name: "description",
    content:
      "Nexus is a beautiful rolodex and CRM, built to help you manage your personal and professional relationships.",
  },
];

export default function Landing() {
  const user = useOptionalUser();

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex flex-col items-center gap-2">
          <Link
            to={href("/")}
            className="flex items-center gap-2 self-center font-medium"
          >
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <HexagonIcon aria-hidden className="size-4" />
            </div>
            Nexus
          </Link>
          <h1 className="text-xl font-bold text-balance">
            Supercharge your relationships
          </h1>
          <p className="text-center text-sm text-pretty">
            Move beyond the CRM—manage all your personal and professional
            relationships with ease.
          </p>
        </div>
        {user ? (
          <div className="flex flex-col items-center gap-2">
            <Button asChild size="sm">
              <Link to={href("/contacts")}>
                Continue to dashboard <span aria-hidden>→</span>
              </Link>
            </Button>
            <p className="text-xs">
              Signed in as <span className="font-semibold">{user.email}</span>
            </p>
          </div>
        ) : (
          <div className="flex justify-center gap-4">
            <Button asChild size="sm">
              <Link to={href("/signup")}>Get started</Link>
            </Button>
            <Button asChild size="sm">
              <Link to={href("/signin")}>Log in</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
