import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { UserIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "~/lib/utils";

export function Avatar({
  className,
  ...props
}: ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className,
      )}
      {...props}
    />
  );
}

export function AvatarImage({
  className,
  ...props
}: ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  );
}

type AvatarFallbackProps = ComponentProps<typeof AvatarPrimitive.Fallback> & {
  name?: string;
};

export function AvatarFallback({ className, ...props }: AvatarFallbackProps) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center bg-muted [&_svg]:size-4",
        className,
      )}
      {...props}
    >
      {getAvatarFallbackChildren(props)}
    </AvatarPrimitive.Fallback>
  );
}

function getAvatarFallbackChildren(props: AvatarFallbackProps) {
  if (props.children || props.asChild) {
    return props.children;
  }

  if (props.name) {
    return getNameInitials(props.name);
  }

  return <UserIcon aria-hidden />;
}

function getNameInitials(name: string) {
  const names = name.trim().split(" ");
  const firstName = names[0] != null ? names[0] : "";
  const lastName = names.length > 1 ? names[names.length - 1] : "";

  return firstName && lastName
    ? `${firstName.charAt(0)}${lastName.charAt(0)}`
    : firstName.charAt(0);
}
