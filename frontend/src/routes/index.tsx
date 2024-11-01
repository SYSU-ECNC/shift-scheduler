import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: () => <RedirectPage />,
});

export default function RedirectPage() {
  return <Navigate to="/auth/login" />;
}
