import { Link, useLocation } from "@tanstack/react-router";
import { GitFork, Home, UserCog } from "lucide-react";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";

const navMain = [
  {
    title: "主页",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "用户管理",
    url: "/dashboard/users",
    icon: UserCog,
  },
];

const navSecondary = [
  {
    title: "源代码",
    url: "https://github.com/SYSU-ECNC/shift-scheduler",
    icon: GitFork,
  },
];

export default function AppSidebarContent() {
  const location = useLocation();

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>应用</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === item.url}
                >
                  <Link to={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup className="mt-auto">
        <SidebarGroupContent>
          <SidebarMenu>
            {navSecondary.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link to={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
