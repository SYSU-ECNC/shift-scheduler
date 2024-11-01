import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/_unauthenticated/auth/login")({
  component: () => <LoginPage />,
});

export default function LoginPage() {
  const schema = z.object({
    username: z.string().min(1, "请输入用户名"),
    password: z.string().min(1, "请输入密码"),
  });
  type FormDataType = z.infer<typeof schema>;

  const {
    handleSubmit,
    register,
    formState: { errors },
    setError,
    setFocus,
  } = useForm<FormDataType>({
    resolver: zodResolver(schema),
  });

  const navigate = useNavigate();

  const { mutate: loginMutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      toast("登录成功");
      navigate({ to: "/dashboard", replace: true });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.message === "用户名不存在") {
          setError("username", {
            message: error.message,
          });
          setFocus("username");
        } else if (error.message === "密码错误") {
          setError("password", {
            message: error.message,
          });
          setFocus("password");
        }
      }
    },
  });

  return (
    <div className="h-screen grid place-items-center">
      <Card>
        <CardHeader>
          <CardTitle>登录</CardTitle>
          <CardDescription>
            请输入用户名（NetID）和密码以登录系统
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-4"
            onSubmit={handleSubmit((payload) => loginMutate(payload))}
          >
            <div className="grid gap-2">
              <Label>用户名</Label>
              <Input
                placeholder="请输入用户名"
                {...register("username")}
                disabled={isPending}
              />
              {errors.username && (
                <span className="text-sm text-destructive">
                  {errors.username.message}
                </span>
              )}
            </div>
            <div className="grid gap-2">
              <Label>密码</Label>
              <Input
                placeholder="请输入密码"
                type="password"
                {...register("password")}
                disabled={isPending}
              />
              {errors.password && (
                <span className="text-sm text-destructive">
                  {errors.password.message}
                </span>
              )}
            </div>
            <div>
              <Button disabled={isPending} className="w-full mt-2">
                {isPending && (
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isPending ? "请稍等" : "登录"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
