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
export function composeSafeRedirectUrl(
  to: FormDataEntryValue | string | null | undefined,
  defaultRedirect: string = "/",
) {
  if (!to || typeof to !== "string") {
    return defaultRedirect;
  }

  to = to.trim();

  if (
    !to.startsWith("/") ||
    to.startsWith("//") ||
    to.startsWith("/\\") ||
    to.includes("..")
  ) {
    return defaultRedirect;
  }

  return to;
}
