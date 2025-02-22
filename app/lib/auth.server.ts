import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "./db.server";
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "./user-validation";

export type Session = typeof auth.$Infer.Session;

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "sqlite",
  }),
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: PASSWORD_MIN_LENGTH,
    maxPasswordLength: PASSWORD_MAX_LENGTH,
  },
});
