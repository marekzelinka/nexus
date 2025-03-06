export type ListOfErrors = Array<string | null | undefined> | null | undefined;

export function ErrorList({
  id,
  errors,
}: {
  id?: string;
  errors?: ListOfErrors;
}) {
  const errorsToShow = errors?.filter(Boolean);
  if (!errorsToShow?.length) {
    return null;
  }

  return (
    <ul role="list" id={id} className="grid gap-1">
      {errorsToShow.map((error) => (
        <li key={error} className="text-[0.8rem] text-destructive">
          {error}
        </li>
      ))}
    </ul>
  );
}
