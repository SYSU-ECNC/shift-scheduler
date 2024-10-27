import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginFormSchema } from "@/lib/form-schemas";
import { z } from "zod";
import { useLogin } from "@/lib/react-query/mutations";
import { ReloadIcon } from "@radix-ui/react-icons";
import { AxiosError, AxiosResponse } from "axios";
import { ApiResponse } from "@/lib/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

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

  const onSuccess = ({ data: { message } }: AxiosResponse<ApiResponse>) => {
    navigate("/dashboard", { replace: true });
    toast(message);
  };

  const onError = (error: AxiosError) => {
    if (error.message === "用户名不存在") {
      setError("username", { message: error.message });
      setFocus("username");
    } else if (error.message === "密码错误") {
      setError("password", { message: error.message });
      setFocus("password");
    }
  };

  const loginMutation = useLogin(onSuccess, onError);

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
