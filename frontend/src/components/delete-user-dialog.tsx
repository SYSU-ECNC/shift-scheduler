import { deleteUser } from "@/lib/api";
import { AlertDialogTitle } from "@radix-ui/react-alert-dialog";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { User } from "@/types/types";

interface ResetPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userID: string;
}

export default function DeleteUserDialog({
  open,
  onOpenChange,
  userID,
}: ResetPasswordDialogProps) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      onOpenChange(false);
      toast("删除用户成功");
      queryClient.setQueryData(["users"], (data: User[]) => {
        return data.filter((user) => user.id !== userID);
      });
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogTitle>删除用户</AlertDialogTitle>
        <AlertDialogDescription>
          你确定要删除该用户吗？（该操作不可逆）
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <Button
            onClick={() => mutation.mutate(userID)}
            disabled={mutation.isPending}
          >
            {mutation.isPending && (
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            )}
            {mutation.isPending ? "请稍等" : "确定"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
