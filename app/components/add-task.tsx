import { LoaderIcon, PlusIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { useFetcher } from "react-router";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function AddTask() {
  const fetcher = useFetcher();
  const isPending =
    fetcher.state !== "idle" &&
    fetcher.formData?.get("intent") === "create-task";

  const formRef = useRef<HTMLFormElement>(null);
  const descriptionInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Clear and focus the input after the first submit
    if (fetcher.data && !isPending) {
      formRef.current?.reset();
      descriptionInputRef.current?.focus();
    }
  }, [isPending]);

  return (
    <fetcher.Form ref={formRef} method="post">
      <input type="hidden" name="intent" value="create-task" />
      <fieldset
        disabled={isPending}
        className="flex gap-2 disabled:pointer-events-none"
      >
        <Input
          ref={descriptionInputRef}
          name="description"
          required
          aria-label="New task"
          placeholder="Add new todo"
          className="h-7"
        />
        <Button
          type="submit"
          variant="outline"
          size="icon"
          aria-label={isPending ? "Adding todo…" : "Add todo"}
          className="size-7"
        >
          {isPending ? (
            <LoaderIcon aria-hidden className="animate-spin" />
          ) : (
            <PlusIcon aria-hidden />
          )}
        </Button>
      </fieldset>
    </fetcher.Form>
  );
}
