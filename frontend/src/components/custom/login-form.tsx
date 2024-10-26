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

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
  });

  const loginMutation = useLogin();

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
              />
              {errors.password && (
                <p className="text-destructive">{errors.password.message}</p>
              )}
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button className="w-full" type="submit" form="login-form">
          登录
        </Button>
      </CardFooter>
    </Card>
  );
}
