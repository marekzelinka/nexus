import { href, redirect } from "react-router";
import { auth, type Session } from "./auth.server";

export async function getAuthSession(
  request: Request,
): Promise<Session | null> {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  return session;
}

export async function requireAuthSession(
  request: Request,
  redirectTo: string = new URL(request.url).pathname,
): Promise<Session> {
  const session = await getAuthSession(request);
  if (!session) {
    const loginParams = new URLSearchParams([["redirectTo", redirectTo]]);

    throw redirect(`${href("/signin")}?${loginParams}`);
  }

  return session;
}
