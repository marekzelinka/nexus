import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(
  to: FormDataEntryValue | string | null | undefined,
  defaultRedirect: string = "/",
) {
  if (!to || typeof to !== "string") return defaultRedirect;

  let trimmedTo = to.trim();

  if (
    !trimmedTo.startsWith("/") ||
    trimmedTo.startsWith("//") ||
    trimmedTo.startsWith("/\\") ||
    trimmedTo.includes("..")
  ) {
    return defaultRedirect;
  }

  return trimmedTo;
}
