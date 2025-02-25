import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { routes } from "./routers";
import { ThemeToggle } from "./components/theme-toggle";

export const queryClient = new QueryClient();

const router = createBrowserRouter(routes);

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <main className="bg-background m-0 p-0">
          <div className="fixed top-4 right-4">
            <ThemeToggle />
          </div>
          <RouterProvider router={router} />
          <Toaster
            position="top-right"
            toastOptions={{
              classNames: {
                error: "bg-red-400 text-white",
                success: "bg-green-400 text-white",
                warning: "text-yellow-400",
                info: "bg-blue-400",
              },
            }}
          />
        </main>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;