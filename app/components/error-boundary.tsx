import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { isRouteErrorResponse, Link, useRouteError } from "react-router";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";

export function GenericErrorBoundary() {
  const error = useRouteError();
  const errorMessage = isRouteErrorResponse(error)
    ? error.data
    : getErrorMessage(error);

  return (
    <div className="mx-auto max-w-lg">
      <div className="space-y-6">
        <Alert variant="destructive" className="[&_svg]:size-4">
          <ExclamationTriangleIcon />
          <AlertTitle>Oops! Something went wrong!</AlertTitle>
          <AlertDescription>
            {errorMessage ??
              "We're sorry, but we encountered an unexpected error."}
          </AlertDescription>
        </Alert>
        <div className="space-y-4">
          <Button asChild variant="outline" className="w-full">
            <Link to="/">Return to Homepage</Link>
          </Button>
        </div>
      </div>
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

  return null;
}
