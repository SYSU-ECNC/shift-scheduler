import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/auth/login/login-page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "./components/ui/sonner";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/auth/login",
    element: <LoginPage />,
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
