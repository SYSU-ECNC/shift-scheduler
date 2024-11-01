import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { logout } from "@/lib/api";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

interface LogoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LogoutDialog({
  open,
  onOpenChange,
}: LogoutDialogProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: logoutMutate, isPending } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
      navigate({ to: "/auth/login", replace: true });
      toast("登出成功");
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast("登出失败", {
          description: error.message,
        });
      }
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>登出</AlertDialogTitle>
          <AlertDialogDescription>确认要登出吗</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>取消</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              logoutMutate();
            }}
            disabled={isPending}
          >
            {isPending && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "请稍等" : "登录"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
