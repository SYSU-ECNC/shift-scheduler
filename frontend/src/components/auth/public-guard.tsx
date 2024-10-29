import { getMe } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

export default function PublicGuard({ children }: { children: ReactNode }) {
  const { isFetching, isError } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });

  if (isFetching) {
    return null;
  }

  return isError ? children : <Navigate to="/dashboard" replace />;
}
