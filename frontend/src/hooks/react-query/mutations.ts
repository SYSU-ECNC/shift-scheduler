import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { loginFormSchema } from "@/lib/form-schemas";
import { ApiResponse, login } from "@/lib/api";
import { AxiosError, AxiosResponse } from "axios";

export function useLogin(
  onSuccess: (res: AxiosResponse<ApiResponse>) => void,
  onError: (error: AxiosError) => void
) {
  return useMutation({
    mutationFn: (data: z.infer<typeof loginFormSchema>) => login(data),
    onSuccess,
    onError,
  });
}
