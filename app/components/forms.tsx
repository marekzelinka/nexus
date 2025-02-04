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
    <ul id={id} className={cn("grid gap-1", className)}>
      {errorsToShow.map((error) => (
        <li key={error} className="text-destructive text-[0.8rem]">
          {error}
        </li>
      ))}
    </ul>
  );
}
