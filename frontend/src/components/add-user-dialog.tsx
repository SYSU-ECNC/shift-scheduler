import { z } from "zod";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "@/lib/api";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ReloadIcon } from "@radix-ui/react-icons";
import { User } from "@/types/types";

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const schema = z.object({
  username: z.string().min(1, { message: "用户名不能为空" }),
  fullName: z.string().min(1, { message: "姓名不能为空" }),
  role: z.enum(["普通助理", "资深助理", "黑心"], {
    message: "请选择用户的身份",
  }),
});

type formDataType = z.infer<typeof schema>;

export default function AddUserDialog({
  open,
  onOpenChange,
}: AddUserDialogProps) {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    setError,
    setFocus,
  } = useForm<formDataType>({
    resolver: zodResolver(schema),
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createUser,
    onSuccess: (newUser: User) => {
      onOpenChange(false);
      toast("创建用户成功");
      queryClient.setQueryData(["users"], (data: User[]) => {
        return [...data, newUser];
      });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.message === "用户名已存在") {
          setError("username", { message: error.message });
          setFocus("username");
        }
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>添加用户</DialogTitle>
          <DialogDescription>
            完成以下表单以添加用户，用户初始密码为 ecncpassword。
          </DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit((data) => mutate(data))}
        >
          <div className="grid grid-cols-5 items-center gap-y-2">
            <Label className="text-end pr-3">用户名</Label>
            <Input
              className="col-span-4"
              placeholder="请输入用户名（NetID）"
              {...register("username")}
              disabled={isPending}
            />
            {errors.username && (
              <span className="text-sm text-destructive col-start-2 col-span-4">
                {errors.username.message}
              </span>
            )}
          </div>
          <div className="grid grid-cols-5 items-center gap-y-2">
            <Label className="text-end pr-3">姓名</Label>
            <Input
              className="col-span-4"
              placeholder="请输入姓名"
              {...register("fullName")}
              disabled={isPending}
            />
            {errors.fullName && (
              <span className="text-sm text-destructive col-start-2 col-span-4">
                {errors.fullName.message}
              </span>
            )}
          </div>
          <div className="grid grid-cols-5 items-center gap-y-2">
            <Label className="text-end pr-3">身份</Label>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isPending}
                >
                  <SelectTrigger className="col-span-4">
                    <SelectValue placeholder="请选择新用户的身份" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="普通助理">普通助理</SelectItem>
                    <SelectItem value="资深助理">资深助理</SelectItem>
                    <SelectItem value="黑心">黑心</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.role && (
              <span className="text-sm text-destructive col-start-2 col-span-4">
                {errors.role.message}
              </span>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" type="reset" disabled={isPending}>
              重置表单
            </Button>
            <Button disabled={isPending}>
              {isPending && (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isPending ? "请稍等" : "添加用户"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
