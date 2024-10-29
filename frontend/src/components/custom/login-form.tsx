import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/api";
import { loginFormSchema } from "@/lib/form-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setFocus,
  } = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
  });
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      navigate("/dashboard", { replace: true });
      toast("登录成功");
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.message === "用户名不存在") {
          setError("username", { message: error.message });
          setFocus("username");
        } else if (error.message === "密码错误") {
          setError("password", { message: error.message });
          setFocus("password");
        }
      }
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof loginFormSchema>> = (data) => {
    loginMutation.mutate(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>登录</CardTitle>
        <CardDescription>
          在下方输入用户名（NetID）和密码进行登录
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="login-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="username">用户名</Label>
              <Input
                {...register("username")}
                type="text"
                id="username"
                placeholder="请输入 NetID"
                disabled={loginMutation.isPending}
              />
              {errors.username && (
                <p className="text-destructive">{errors.username.message}</p>
              )}
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="password">密码</Label>
              <Input
                {...register("password")}
                type="password"
                id="password"
                placeholder="请输入密码"
                disabled={loginMutation.isPending}
              />
              {errors.password && (
                <p className="text-destructive">{errors.password.message}</p>
              )}
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          type="submit"
          form="login-form"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending && (
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          )}
          {loginMutation.isPending ? "请稍等" : "登录"}
        </Button>
      </CardFooter>
    </Card>
  );
}
