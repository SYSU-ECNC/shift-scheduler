import { getMe } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

export default function PrivateGuard({ children }: { children: ReactNode }) {
  const { isFetching, isError } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });

  if (isFetching) {
    return null;
  }

  return isError ? <Navigate to="/auth/login" replace /> : children;
}
