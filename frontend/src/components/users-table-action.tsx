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

export default function UsersTableAction({ row }: { row: Row<User> }) {
  const [isUpdateRoleDialogOpen, setUpdateRoleDialogOpen] = useState(false);

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
          <DropdownMenuItem>重置密码</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive">
            删除用户
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <UpdateRoleDialog
        open={isUpdateRoleDialogOpen}
        onOpenChange={setUpdateRoleDialogOpen}
        userID={row.getValue("id")}
      />
    </>
  );
}
