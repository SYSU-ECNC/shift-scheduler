import { User } from "@/types/types";
import { Row } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import UpdateRoleDialog from "./update-role-dialog";
import ResetPasswordDialog from "./reset-password-dialog";
import DeleteUserDialog from "./delete-user-dialog";

export default function UsersTableAction({ row }: { row: Row<User> }) {
  const [isUpdateRoleDialogOpen, setUpdateRoleDialogOpen] = useState(false);
  const [isResetPasswordDialogOpen, setResetPasswordDialogOpen] =
    useState(false);
  const [isDeleteUserDialogOpen, setDeleteUserDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>编辑用户</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setUpdateRoleDialogOpen(true)}>
            修改身份
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setResetPasswordDialogOpen(true)}>
            重置密码
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive"
            onClick={() => setDeleteUserDialogOpen(true)}
          >
            删除用户
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <UpdateRoleDialog
        open={isUpdateRoleDialogOpen}
        onOpenChange={setUpdateRoleDialogOpen}
        userID={row.getValue("id")}
      />
      <ResetPasswordDialog
        open={isResetPasswordDialogOpen}
        onOpenChange={setResetPasswordDialogOpen}
        userID={row.getValue("id")}
      />
      <DeleteUserDialog
        open={isDeleteUserDialogOpen}
        onOpenChange={setDeleteUserDialogOpen}
        userID={row.getValue("id")}
      />
    </>
  );
}
