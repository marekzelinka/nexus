import { type ComponentProps, type ReactNode } from "react";
import { cn } from "~/lib/utils";

export function EmptyState({
  icon,
  title = "No data",
  description,
  className,
  children,
  ...props
}: ComponentProps<"div"> & {
  icon?: ReactNode;
  title?: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4",
        className,
      )}
      {...props}
    >
      {icon ? (
        <div className="flex items-center justify-center text-4xl text-muted-foreground">
          {icon}
        </div>
      ) : null}
      <div className="flex flex-col gap-0.5 text-center">
        <h3 className="font-semibold">{title}</h3>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children}
    </div>
  );
}
