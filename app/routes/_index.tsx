import { Link } from "react-router";
import { Logo } from "~/components/logo";
import { buttonVariants } from "~/components/ui/button";
import { useOptionalUser } from "~/lib/user";
import type { Route } from "./+types/_index";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Welcome" }];
};

export default function Component() {
  const user = useOptionalUser();

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <div className="mx-auto w-full max-w-xl">
        <Logo className="mx-auto h-11 w-auto" />
        <div className="mt-10 text-center">
          <h1 className="text-4xl leading-[1.1] font-bold tracking-tighter text-balance">
            Supercharge your relationships
          </h1>
          <p className="text-foreground mx-auto max-w-2xl text-lg font-light text-pretty">
            Keep in touch with your personal and professional relationships.
            Move beyond the CRM&mdash;impress with thoughtfulness.
          </p>
        </div>
        <div className="mt-2 flex justify-center gap-2">
          {user ? (
            <Link to="/contacts" className={buttonVariants({ size: "sm" })}>
              <span>
                Continue to contacts <span aria-hidden>→</span>
              </span>
            </Link>
          ) : (
            <>
              <Link to="/join" className={buttonVariants({ size: "sm" })}>
                Get started
              </Link>
              <Link
                to="/login"
                className={buttonVariants({ size: "sm", variant: "ghost" })}
              >
                <span>
                  Log in <span aria-hidden>→</span>
                </span>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
