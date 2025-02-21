import { SearchIcon, StarIcon } from "lucide-react";
import { Form, href, NavLink, Outlet } from "react-router";
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
import { cn } from "~/lib/utils";
import type { Route } from "./+types/contacts";

export const meta: Route.MetaFunction = () => [{ title: "People" }];

export default function Contacts() {
  const contacts = [
    {
      id: "1",
      first: "Your",
      last: "Name",
      avatar: "https://placecats.com/200/200",
      favorite: false,
    },
    {
      id: "2",
      first: "Your",
      last: "Friend",
      avatar: "https://placecats.com/200/200",
      favorite: true,
    },
  ];

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
              {contacts.map((contact) => (
                <NavLink
                  key={contact.id}
                  to={href("/contacts/:contactId", { contactId: contact.id })}
                  prefetch="intent"
                  className={({ isActive }) =>
                    cn(
                      "group flex items-center gap-2 p-4 not-last:border-b",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
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
                  {contact.favorite ? (
                    <StarIcon aria-hidden className="size-4 fill-current" />
                  ) : null}
                </NavLink>
              ))}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="mx-auto w-full max-w-3xl flex-1">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </>
  );
}

function SearchForm() {
  return (
    <Form>
      <div>
        <Label htmlFor="search" className="sr-only">
          Search
        </Label>
        <div className="grid grid-cols-1">
          <SidebarInput
            type="search"
            name="search"
            id="search"
            placeholder="Type to search..."
            className="col-start-1 row-start-1 pl-8"
          />
          <SearchIcon
            aria-hidden
            className="pointer-events-none col-start-1 row-start-1 ml-2 size-4 self-center opacity-50"
          />
        </div>
      </div>
    </Form>
  );
}
