import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { isRouteErrorResponse, useRouteError } from "react-router";

export function GeneralErrorBoundary() {
  const error = useRouteError();
  const errorMessage = isRouteErrorResponse(error)
    ? error.data
    : getErrorMessage(error);

  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-destructive [&_svg]:size-5">
        <ExclamationTriangleIcon
          className="text-destructive-foreground"
          aria-hidden
        />
      </div>
      <h3 className="mt-4 text-2xl font-bold tracking-tight">
        Oops! An error occurred…
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">{errorMessage}</p>
    </div>
  );
}

function getErrorMessage(error: unknown) {
  if (typeof error === "string") {
    return error;
  }

  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  console.error("Unable to get error message for error", error);

  return "Unknown Error";
}
