import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
    "/_authenticated/dashboard/_layout/submit-free-time"
)({
    component: () => <SubmitFreeTimePage />,
});

export default function SubmitFreeTimePage() {
    return <div>Submit Free Time</div>;
}
