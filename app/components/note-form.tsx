import { LoaderIcon, PlusIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { useFetcher } from "react-router";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

export function NoteForm() {
  const fetcher = useFetcher();

  const isPending =
    fetcher.state !== "idle" &&
    fetcher.formData?.get("intent") === "create-note";

  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Clear and focus the input after the first submit
    if (fetcher.data && !isPending) {
      formRef.current?.reset();
      textareaRef.current?.focus();
    }
  }, [isPending]);

  return (
    <fetcher.Form ref={formRef} method="post">
      <input type="hidden" name="intent" value="create-note" />
      <fieldset
        className="relative disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isPending}
      >
        <div className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring">
          <Label htmlFor="content" className="sr-only">
            Note
          </Label>
          <Textarea
            ref={textareaRef}
            name="content"
            id="content"
            required
            placeholder="What would you like to add?"
            className="resize-none border-0 p-3 shadow-none focus-visible:ring-0 disabled:opacity-100"
          />
          {/* Spacer element to match the height of the toolbar */}
          <div className="py-2" aria-hidden>
            <div className="h-7" />
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 flex px-3 py-2">
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto size-7 text-muted-foreground disabled:opacity-100"
          >
            {isPending ? (
              <LoaderIcon aria-hidden className="animate-spin" />
            ) : (
              <PlusIcon aria-hidden />
            )}
            <span className="sr-only">Add note</span>
          </Button>
        </div>
      </fieldset>
    </fetcher.Form>
  );
}
