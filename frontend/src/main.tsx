import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/auth/login/login-page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "./components/ui/sonner";
import Root from "./pages/root";
import ErrorPage from "./pages/error-page";
import DashboardLayout from "./pages/dashboard/dashboard-layout";
import OverviewPage from "./pages/dashboard/overview-page";
import PublicGuard from "./components/auth/public-guard";
import PrivateGuard from "./components/auth/private-guard";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      retry: false,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/auth/login",
    element: (
      <PublicGuard>
        <LoginPage />
      </PublicGuard>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <PrivateGuard>
        <DashboardLayout />
      </PrivateGuard>
    ),
    children: [
      {
        index: true,
        element: <OverviewPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      {import.meta.env.MODE == "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
    {/* Toaster 需要通过 toastOptions 强制它使用别的字体 */}
    <Toaster toastOptions={{ className: "font-display" }} />
  </StrictMode>
);
