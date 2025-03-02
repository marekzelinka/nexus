import { cn } from "~/lib/utils";

export type ListOfErrors = Array<string | null | undefined> | null | undefined;

export function ErrorList({
  id,
  errors,
  className,
}: {
  id?: string;
  errors?: ListOfErrors;
  className?: string;
}) {
  const errorsToShow = errors?.filter(Boolean);
  if (!errorsToShow?.length) {
    return null;
  }

  return (
    <ul role="list" id={id} className={cn("grid gap-1", className)}>
      {errorsToShow.map((error) => (
        <li key={error} className="text-[0.8rem] text-destructive">
          {error}
        </li>
      ))}
    </ul>
  );
}
