import { getMe } from "@/lib/api";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_unauthenticated")({
  beforeLoad: async ({ context: { queryClient } }) => {
    try {
      await queryClient.fetchQuery({
        queryKey: ["me"],
        queryFn: getMe,
      });

      return redirect({
        to: "/dashboard",
        replace: true,
      });
    } catch {
      // Do nothing
    }
  },
  component: () => <Outlet />,
});
