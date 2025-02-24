import { HexagonIcon } from "lucide-react";
import { href, Link, Outlet, redirect } from "react-router";
import { getAuthSession } from "~/lib/session.server";
import type { Route } from "./+types/auth";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getAuthSession(request);
  if (session) {
    throw redirect("/");
  }

  return {};
}

export default function AuthLayout() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted/40 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          to={href("/")}
          className="flex items-center gap-2 self-center font-medium"
        >
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <HexagonIcon aria-hidden className="size-4" />
          </div>
          Nexus
        </Link>
        <Outlet />
      </div>
    </div>
  );
}
