import {
  ChevronsUpDown,
  HexagonIcon,
  LogOutIcon,
  UsersIcon,
} from "lucide-react";
import type { ElementType } from "react";
import {
  href,
  Link,
  NavLink,
  Outlet,
  useMatch,
  useNavigate,
} from "react-router";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "~/components/ui/sidebar";
import { useUser } from "~/hooks/use-user";
import { signOut } from "~/lib/auth";
import { requireAuthSession } from "~/lib/session.server";
import type { Route } from "./+types/dashboard";

export async function loader({ request }: Route.LoaderArgs) {
  await requireAuthSession(request);

  return {};
}

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <Outlet />
    </SidebarProvider>
  );
}

function AppSidebar() {
  const data = {
    navMain: [
      {
        title: "People",
        href: href("/contacts"),
        icon: UsersIcon,
      },
    ],
  };

  return (
    <Sidebar
      collapsible="none"
      className="h-auto !w-[calc(var(--sidebar-width-icon)_+_1px)] border-r"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg" className="h-8 p-0">
              <Link to={href("/")}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <HexagonIcon aria-hidden className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Nexus</span>
                  <span className="truncate text-xs">Free trail</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="px-0">
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButtonNavLink
                    title={item.title}
                    href={item.href}
                    icon={item.icon}
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <NavUser />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

function SidebarMenuButtonNavLink({
  title,
  href,
  icon: Icon,
}: {
  title: string;
  href: string;
  icon: ElementType;
}) {
  const match = useMatch(href);
  const active = Boolean(match);

  return (
    <SidebarMenuButton
      asChild
      tooltip={{
        children: title,
        hidden: false,
      }}
      isActive={active}
      className="px-2"
    >
      <NavLink to={href} prefetch="intent">
        <Icon aria-hidden /> {title}
      </NavLink>
    </SidebarMenuButton>
  );
}

function NavUser() {
  const user = useUser();

  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className="h-8 p-0 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Avatar className="rounded-lg">
            <AvatarFallback className="bg-primary text-primary-foreground" />
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{user.name}</span>
            <span className="truncate text-xs">{user.email}</span>
          </div>
          <ChevronsUpDown aria-hidden className="ml-auto size-4" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="right"
        align="end"
        sideOffset={4}
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="rounded-lg">
              <AvatarFallback className="bg-primary text-primary-foreground" />
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            toast.promise(
              signOut({
                fetchOptions: {
                  onSuccess: () => navigate(href("/")),
                },
              }),
              {
                loading: "Signing out…",
                success: "Signed out successfully!",
                error: "Error signing out",
              },
            );
          }}
        >
          <LogOutIcon aria-hidden />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
