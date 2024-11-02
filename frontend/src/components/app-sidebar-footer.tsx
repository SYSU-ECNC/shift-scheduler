import { useSuspenseQuery } from "@tanstack/react-query";
import { ChevronsUpDown, KeyRound, LogOut } from "lucide-react";
import { useState } from "react";
import LogoutDialog from "./logout-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import UpdatePasswordDialog from "./update-password-dialog";
import { getMe } from "@/lib/api";

export default function AppSidebarFooter() {
  const { data: me } = useSuspenseQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });

  const [isLogoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [isUpdatePasswordDialogOpen, setUpdatePasswordDialogOpen] =
    useState(false);

  return (
    <>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src="/avatar.jpg" />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid">
                    <span className="font-semibold">
                      {me?.fullName}({me?.username})
                    </span>
                    <span className="text-xs">{me?.role}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] rounded-lg"
                side="right"
                align="end"
                sideOffset={4}
              >
                {/* 修改密码 */}
                <DropdownMenuItem
                  onClick={() => setUpdatePasswordDialogOpen(true)}
                >
                  <KeyRound />
                  修改密码
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {/* 登出 */}
                <DropdownMenuItem onClick={() => setLogoutDialogOpen(true)}>
                  <LogOut />
                  登出
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <LogoutDialog
        open={isLogoutDialogOpen}
        onOpenChange={setLogoutDialogOpen}
      />
      <UpdatePasswordDialog
        open={isUpdatePasswordDialogOpen}
        onOpenChange={setUpdatePasswordDialogOpen}
      />
    </>
  );
}
