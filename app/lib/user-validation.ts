import { z } from "zod";

export const NameSchema = z
  .string({ required_error: "Name is required" })
  .trim()
  .min(3, { message: "Name is too short" })
  .max(40, { message: "Name is too long" });

export const EmailSchema = z
  .string({ required_error: "Email is required" })
  .trim()
  .email({ message: "Email is invalid" })
  .min(3, { message: "Email is too short" })
  .max(100, { message: "Email is too long" })
  // Users can type the email in any case, but we store it in lowercase
  .transform((value) => value.toLowerCase());

export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_MAX_LENGTH = 72;

export const PasswordSchema = z
  .string({ required_error: "Password is required" })
  .trim()
  .min(PASSWORD_MIN_LENGTH, { message: "Password is too short" })
  // NOTE: bcrypt has a limit of 72 bytes (which should be plenty long)
  .refine(
    (val) => new TextEncoder().encode(val).length <= PASSWORD_MAX_LENGTH,
    {
      message: "Password is too long",
    },
  );
