import type { Contact } from "@prisma/client";
import { LoaderIcon, SearchIcon, StarIcon } from "lucide-react";
import { matchSorter } from "match-sorter";
import { useEffect, useRef, type PropsWithChildren } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import {
  Form,
  href,
  NavLink,
  Outlet,
  redirect,
  useFetcher,
  useNavigation,
  useSearchParams,
  useSubmit,
} from "react-router";
import sortBy from "sort-by";
import { useSpinDelay } from "spin-delay";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
} from "~/components/ui/sidebar";
import { db } from "~/lib/db.server";
import { requireAuthSession } from "~/lib/session.server";
import { cn } from "~/lib/utils";
import type { Route } from "./+types/contacts";

export const meta: Route.MetaFunction = () => [{ title: "People" }];

export async function loader({ request }: Route.LoaderArgs) {
  const session = await requireAuthSession(request);

  const url = new URL(request.url);
  const query = url.searchParams.get("q");

  let contacts = await db.contact.findMany({
    where: { userId: session.user.id },
    orderBy: [{ createdAt: "desc" }, { last: "asc" }],
  });
  if (query) {
    contacts = matchSorter(contacts, query, {
      keys: ["first", "last"],
    });
  }

  return { query, contacts: contacts.sort(sortBy("last", "createdAt")) };
}

export async function action({ request }: Route.ActionArgs) {
  const session = await requireAuthSession(request);

  const contact = await db.contact.create({
    data: { user: { connect: { id: session.user.id } } },
  });

  return redirect(href("/contacts/:contactId", { contactId: contact.id }));
}

export default function Contacts({ loaderData }: Route.ComponentProps) {
  const { contacts } = loaderData;

  const navigation = useNavigation();
  const loading = navigation.state === "loading";
  const searching = new URLSearchParams(navigation.location?.search).has("q");
  const showLoadingOverlay = useSpinDelay(loading && !searching, {
    delay: 200,
  });

  return (
    <>
      <Sidebar
        collapsible="none"
        className="h-auto border-r [--sidebar-width:300px]"
      >
        <SidebarHeader className="gap-3.5 border-b p-4">
          <div className="text-base font-medium text-foreground">People</div>
          <div className="flex gap-3">
            <search role="search" className="flex-1">
              <SearchForm />
            </search>
            <Form method="post">
              <Button type="submit" size="sm" aria-label="New contact">
                New
              </Button>
            </Form>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="px-0">
            <SidebarGroupContent>
              {contacts.length ? (
                contacts.map((contact) => (
                  <NavLink
                    key={contact.id}
                    to={href("/contacts/:contactId", { contactId: contact.id })}
                    prefetch="intent"
                    className={({ isActive, isPending }) =>
                      cn(
                        "flex items-center gap-2 p-4 not-last:border-b",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : isPending
                            ? "bg-sidebar-accent"
                            : contact.first || contact.last
                              ? ""
                              : "text-muted-foreground",
                        !isActive || !isPending
                          ? "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                          : "",
                      )
                    }
                  >
                    <span className="flex-1 truncate text-sm leading-tight font-medium">
                      {contact.first || contact.last ? (
                        <>
                          {contact.first} {contact.last}
                        </>
                      ) : (
                        "No Name"
                      )}
                    </span>
                    <Favorite contact={contact}>
                      <StarIcon aria-hidden className="size-4 fill-current" />
                    </Favorite>
                  </NavLink>
                ))
              ) : (
                <div className="p-4">
                  <p className="text-sm text-sidebar-foreground/70">
                    No contacts
                  </p>
                </div>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset
        className={cn(
          "transition-opacity",
          showLoadingOverlay ? "opacity-25" : "",
        )}
      >
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="w-full flex-1">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </>
  );
}

function SearchForm() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");

  // Used to submit the form for every keystroke.
  const submit = useSubmit();

  const navigation = useNavigation();
  const searching = new URLSearchParams(navigation.location?.search).has("q");
  const showSearchSpinner = useSpinDelay(searching, { delay: 200 });

  const inputRef = useRef<HTMLInputElement>(null);

  // Sync search input value with the URL Search Params.
  useEffect(() => {
    const input = inputRef.current;
    if (input) {
      input.value = query ?? "";
    }
  }, [query]);

  // Adds a keyboard shortcut to focus the search input.
  const SEARCH_KEYBOARD_SHORTCUT = "/";
  useHotkeys(
    SEARCH_KEYBOARD_SHORTCUT,
    () => {
      const input = inputRef.current;
      if (input) {
        input.focus({ preventScroll: true });
        input.select();
      }
    },
    { preventDefault: true },
  );

  return (
    <Form
      onChange={(event) => {
        const isFirstSearch = query === null;
        submit(event.currentTarget, {
          replace: !isFirstSearch,
        });
      }}
    >
      <div>
        <Label htmlFor="q" className="sr-only">
          Search contacts
        </Label>
        <div className="grid grid-cols-1">
          <SidebarInput
            ref={inputRef}
            type="search"
            name="q"
            id="q"
            defaultValue={query ?? undefined}
            placeholder="Type to search..."
            className="col-start-1 row-start-1 pr-8 pl-8"
          />
          <div className="pointer-events-none col-start-1 row-start-1 ml-2 self-center opacity-50">
            {showSearchSpinner ? (
              <LoaderIcon aria-hidden className="size-4 animate-spin" />
            ) : (
              <SearchIcon aria-hidden className="size-4" />
            )}
          </div>
          <div className="pointer-events-none col-start-1 row-start-1 mr-2 self-center justify-self-end">
            <kbd className="flex h-5 items-center rounded border bg-sidebar-accent p-1 px-1.5 font-mono text-[10px] font-medium tracking-widest text-sidebar-accent-foreground">
              /
            </kbd>
          </div>
        </div>
      </div>
    </Form>
  );
}

function Favorite({
  contact,
  children,
}: PropsWithChildren<{
  contact: Pick<Contact, "id" | "favorite">;
}>) {
  const fetcher = useFetcher({ key: `contact:${contact.id}` });
  const favorite = fetcher.formData
    ? fetcher.formData.get("favorite") === "true"
    : Boolean(contact.favorite);
  if (!favorite) {
    return null;
  }

  return children;
}
