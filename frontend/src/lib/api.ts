import { loginFormSchema } from "@/lib/form-schemas";
import axios, { AxiosResponse } from "axios";
import { z } from "zod";
import { Me } from "@/lib/types";

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
  withCredentials: true,
});

export interface ApiResponse<T = unknown> {
  message: string;
  data?: T;
}

axiosInstance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.data && error.response.data.error) {
      error.message = error.response.data.error;
    }
    return Promise.reject(error);
  }
);

export async function login(data: z.infer<typeof loginFormSchema>) {
  return await axiosInstance.post<ApiResponse>("/auth/login", data);
}

export async function getMe() {
  return await axiosInstance.get<ApiResponse<Me>>("/private/me/info");
}
