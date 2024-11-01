import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard/_layout/")({
  component: () => <DashboardOverview />,
});

export default function DashboardOverview() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <span className="font-semibold">主页</span>
      <span className="text-sm">
        如果你看到这里一篇空白，不用担心，因为我还没想好这里放什么:)
      </span>
    </div>
  );
}
