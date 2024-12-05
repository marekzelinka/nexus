import { Outlet, redirect } from "react-router";
import { getUserId } from "~/utils/auth.server";
import type { Route } from "./+types/_auth";

export async function loader({ request }: Route.LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) {
    throw redirect("/");
  }

  return {};
}

export default function Component() {
  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12">
      <Outlet />
    </div>
  );
}
