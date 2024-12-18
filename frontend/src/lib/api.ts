import { User } from "@/types/types";
import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: import.meta.env.DEV,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error instanceof AxiosError) {
      if (error.response && error.response.data && error.response.data.error) {
        error.message = error.response.data.error;
      }
    }

    return Promise.reject(error);
  }
);

export const login = (data: { username: string; password: string }) =>
  api.post("/api/v1/auth/login", data);

export const logout = () => api.post("/api/v1/auth/logout");

export const getMe = () => api.get<User>("/api/v1/me").then((res) => res.data);

export const updatePassword = (data: {
  oldPassword: string;
  newPassword: string;
}) => api.patch("/api/v1/me/password", data);

export const getAllUsers = () =>
  api.get<User[]>("/api/v1/users").then((res) => res.data);

export const createUser = (data: {
  username: string;
  fullName: string;
  role: string;
}) => api.post("/api/v1/users", data).then((res) => res.data);

export const updateUser = (data: {
  role?: string;
  needResetPassword?: boolean;
  userID: string;
}) =>
  api
    .put(`/api/v1/users/${data.userID}`, {
      role: data.role,
      needResetPassword: data.needResetPassword,
    })
    .then((res) => res.data);

export const deleteUser = (userID: string) =>
  api.delete(`/api/v1/users/${userID}`);
