import { useMe } from "@/hooks/react-query/queries";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface PublicGuardProps {
  children: ReactNode;
}

export default function PublicGuard({ children }: PublicGuardProps) {
  const meQuery = useMe();
  const navigate = useNavigate();

  if (meQuery.isFetching) {
    return null;
  }

  if (meQuery.isSuccess) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  if (meQuery.isError) {
    return children;
  }
}
