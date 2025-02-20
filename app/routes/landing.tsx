import { ArrowRightIcon, HexagonIcon, LogInIcon } from "lucide-react";
import { href, Link } from "react-router";
import { Button } from "~/components/ui/button";
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
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <Link
              to={href("/")}
              className="flex items-center gap-2 font-medium"
            >
              <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <HexagonIcon aria-hidden className="size-4" />
              </div>
              Nexus
            </Link>
            <h1 className="text-xl font-bold">
              Supercharge your relationships
            </h1>
            <p className="text-center text-sm text-pretty">
              Move beyond the CRM—manage all your personal and professional
              relationships with ease.
            </p>
          </div>
          <div className="flex items-center justify-center gap-4">
            <Button size="sm">
              Get started
              <ArrowRightIcon aria-hidden />
            </Button>
            <span className="text-xs text-muted-foreground">Or</span>
            <Button size="sm">
              Sign in
              <LogInIcon aria-hidden />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
