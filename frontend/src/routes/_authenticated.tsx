import { getMe } from "@/lib/api";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context: { queryClient } }) => {
    try {
      await queryClient.fetchQuery({
        queryKey: ["me"],
        queryFn: getMe,
      });
    } catch {
      throw redirect({
        to: "/auth/login",
        replace: true,
      });
    }
  },
  component: () => <Outlet />,
});
