import { EyeClosedIcon, EyeIcon } from "lucide-react";
import { useState, type ComponentProps } from "react";
import { cn } from "~/lib/utils";
import { Input } from "./input";
import { Toggle } from "./toggle";

export function PasswordInput({
  defaultVisible = false,
  className,
  ...props
}: ComponentProps<typeof Input> & {
  defaultVisible?: boolean;
}) {
  const [showPassword, setShowPassword] = useState(defaultVisible);

  const IconComp = showPassword ? EyeIcon : EyeClosedIcon;

  return (
    <div className="grid grid-cols-1">
      <Input
        className={cn("col-start-1 row-start-1", className)}
        {...props}
        type={showPassword ? "text" : "password"}
      />
      <div
        aria-hidden
        className="col-start-1 row-start-1 mr-3 self-center justify-self-end"
      >
        <Toggle
          tabIndex={-1}
          type="button"
          variant="ghost"
          size="icon"
          pressed={showPassword}
          onPressedChange={setShowPassword}
          className="-mr-1 size-7"
        >
          <IconComp aria-hidden className="size-4" />
          <span className="sr-only">Toggle password visibility</span>
        </Toggle>
      </div>
    </div>
  );
}
