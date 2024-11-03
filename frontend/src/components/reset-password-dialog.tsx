import { updateUser } from "@/lib/api";
import { AlertDialogTitle } from "@radix-ui/react-alert-dialog";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";

interface ResetPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userID: string;
}

export default function ResetPasswordDialog({
  open,
  onOpenChange,
  userID,
}: ResetPasswordDialogProps) {
  const mutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      onOpenChange(false);
      toast("重置密码成功");
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogTitle>重置密码</AlertDialogTitle>
        <AlertDialogDescription>
          你确定要重置密码吗？（重置后的密码为 ecncpassword）
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <Button
            onClick={() =>
              mutation.mutate({
                userID,
                needResetPassword: true,
              })
            }
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
