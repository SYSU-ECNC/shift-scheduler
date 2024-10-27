import { useMe } from "@/hooks/react-query/queries";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface PrivateGuardProps {
  children: ReactNode;
}

export default function PrivateGuard({ children }: PrivateGuardProps) {
  const meQuery = useMe();
  const navigate = useNavigate();

  if (meQuery.isFetching) {
    return null;
  }

  if (meQuery.isError) {
    navigate("/auth/login", { replace: true });
    return null;
  }

  if (meQuery.isSuccess) {
    return children;
  }
}
