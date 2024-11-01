import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { updatePassword } from "@/lib/api";
import { toast } from "sonner";
import { AxiosError } from "axios";

interface UpdatePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const schema = z
  .object({
    oldPassword: z.string().min(1, {
      message: "请输入旧密码",
    }),
    newPassword: z
      .string()
      .min(8, {
        message: "新密码不许少于 8 位",
      })
      .max(20, {
        message: "新密码不许多于 20 位",
      }),
    newPasswordConfirm: z.string().min(1, {
      message: "请确认新密码",
    }),
  })
  .refine((data) => data.newPassword === data.newPasswordConfirm, {
    message: "两次输入的新密码不一致",
    path: ["newPasswordConfirm"],
  });

type formData = z.infer<typeof schema>;

export default function UpdatePasswordDialog({
  open,
  onOpenChange,
}: UpdatePasswordDialogProps) {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    setError,
    setFocus,
  } = useForm<formData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    reset();
  }, [open, reset]);

  const { mutate } = useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      toast("修改密码成功");
      onOpenChange(false);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.message === "旧密码错误") {
          setError("oldPassword", { message: error.message });
          setFocus("oldPassword");
        }
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>修改密码</DialogTitle>
          <DialogDescription>输入新旧密码以修改密码</DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit((data) =>
            mutate({
              oldPassword: data.oldPassword,
              newPassword: data.newPassword,
            })
          )}
          onReset={() => reset()}
        >
          <div className="grid grid-cols-5 items-center gap-2">
            <Label className="text-right" htmlFor="oldPassword">
              旧密码
            </Label>
            <Input
              {...register("oldPassword")}
              id="oldPassword"
              type="password"
              placeholder="请输入旧密码"
              className="col-span-4"
            />
            {errors.oldPassword && (
              <div className="text-sm text-destructive col-start-2 col-span-4">
                {errors.oldPassword.message}
              </div>
            )}
          </div>
          <div className="grid grid-cols-5 items-center gap-2">
            <Label className="text-right" htmlFor="newPassword">
              新密码
            </Label>
            <Input
              {...register("newPassword")}
              id="newPassword"
              type="password"
              placeholder="请输入新密码"
              className="col-span-4"
            />
            {errors.newPassword && (
              <div className="text-sm text-destructive col-start-2 col-span-4">
                {errors.newPassword.message}
              </div>
            )}
          </div>
          <div className="grid grid-cols-5 items-center gap-2">
            <Label className="text-right" htmlFor="newPasswordConfirm">
              确认新密码
            </Label>
            <Input
              {...register("newPasswordConfirm")}
              id="newPasswordConfirm"
              type="password"
              placeholder="请确认新密码"
              className="col-span-4"
            />
            {errors.newPasswordConfirm && (
              <div className="text-sm text-destructive col-start-2 col-span-4">
                {errors.newPasswordConfirm.message}
              </div>
            )}
          </div>
          <div className="w-full flex justify-end">
            <div className="flex gap-4">
              <Button variant="outline" type="reset">
                重置
              </Button>
              <Button type="submit">确认修改</Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
