import UsersTable from "@/components/users-table";
import { getAllUsers } from "@/lib/api";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard/_layout/users")(
  {
    loader: async ({ context: { queryClient } }) => {
      await queryClient.fetchQuery({
        queryKey: ["users"],
        queryFn: getAllUsers,
      });
    },
    component: () => <UsersManagementPage />,
  }
);

export default function UsersManagementPage() {
  return <UsersTable />;
}
