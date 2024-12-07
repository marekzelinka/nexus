import type { HTMLAttributes } from "react";
import { cx } from "~/lib/utils";

export const Skeleton = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cx("animate-pulse rounded-md bg-primary/10", className)}
      {...props}
    />
  );
};
