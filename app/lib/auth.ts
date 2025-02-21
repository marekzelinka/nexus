import { createAuthClient } from "better-auth/react";

export type ClientSession = typeof authClient.$Infer.Session;

export const authClient = createAuthClient();

export const { signIn, signUp, signOut, useSession } = authClient;
