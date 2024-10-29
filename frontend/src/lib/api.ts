import { loginFormSchema } from "@/lib/form-schemas";
import { Me } from "@/lib/types";
import axios, { AxiosError } from "axios";
import { z } from "zod";

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
  withCredentials: true,
});

export interface errorResponse {
  error: string;
}

axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error instanceof AxiosError) {
      if (error.response?.data.error) {
        error.message = error.response?.data.error;
      }
    }
    return Promise.reject(error);
  }
);

export async function login(data: z.infer<typeof loginFormSchema>) {
  return await axiosInstance.post("/auth/login", data);
}

export async function logout() {
  return await axiosInstance.post("/auth/logout", null);
}

export async function getMe() {
  return await axiosInstance.get<Me>("/private/me/info");
}
