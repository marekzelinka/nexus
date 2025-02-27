import { AlertCircleIcon } from "lucide-react";
import { href, isRouteErrorResponse, Link, useRouteError } from "react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";

export function GenericErrorBoundary() {
  const error = useRouteError();

  let details = "An unexpected error occurred.";
  if (isRouteErrorResponse(error)) {
    details = error.data || error.statusText || details;
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="flex flex-col gap-4">
        <Alert variant="destructive">
          <AlertCircleIcon aria-hidden />
          <AlertTitle>Oops! Something went wrong!</AlertTitle>
          <AlertDescription>{details}</AlertDescription>
        </Alert>
        <Button asChild variant="outline" className="w-full">
          <Link to={href("/")}>Return to Homepage</Link>
        </Button>
        {import.meta.env.DEV && error && error instanceof Error ? (
          <ErrorDetails error={error} />
        ) : null}
      </div>
    </div>
  );
}

function ErrorDetails({ error }: { error: Error }) {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>Error message</AccordionTrigger>
        <AccordionContent>{error.message}</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Stack trace</AccordionTrigger>
        <AccordionContent>
          <pre className="max-h-[650px] overflow-x-auto font-mono">
            {error.stack}
          </pre>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
