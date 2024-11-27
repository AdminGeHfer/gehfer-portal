import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AuthGuard } from "./components/auth/AuthGuard";

const Login = lazy(() => import("./pages/Login"));
const Apps = lazy(() => import("./pages/Apps"));
const RNCList = lazy(() => import("./pages/quality/RNCList"));
const RNCDetail = lazy(() => import("./pages/quality/RNCDetail"));
const Dashboard = lazy(() => import("./pages/quality/Dashboard"));
const Users = lazy(() => import("./pages/admin/Users"));
const Products = lazy(() => import("./pages/admin/Products"));
const AccessControl = lazy(() => import("./pages/portaria/AccessControl"));
const PortariaList = lazy(() => import("./pages/portaria/PortariaList"));
const ScheduledCollections = lazy(() => import("./pages/quality/ScheduledCollections"));

// Configure QueryClient with performance optimizations
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
  </div>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => (
  <AuthGuard>{children}</AuthGuard>
);

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <DndProvider backend={HTML5Backend}>
            <Toaster />
            <Sonner />
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/apps" element={<ProtectedRoute><Apps /></ProtectedRoute>} />
                
                {/* Quality Routes */}
                <Route path="/quality" element={<Navigate to="/quality/dashboard" replace />} />
                <Route path="/quality/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/quality/rnc" element={<ProtectedRoute><RNCList /></ProtectedRoute>} />
                <Route path="/quality/rnc/:id" element={<ProtectedRoute><RNCDetail /></ProtectedRoute>} />
                <Route path="/quality/collections" element={<ProtectedRoute><ScheduledCollections /></ProtectedRoute>} />
                
                {/* Admin Routes */}
                <Route path="/admin/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
                <Route path="/admin/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
                
                {/* Portaria Routes */}
                <Route path="/portaria" element={<Navigate to="/portaria/acesso" replace />} />
                <Route path="/portaria/acesso" element={<ProtectedRoute><AccessControl /></ProtectedRoute>} />
                <Route path="/portaria/filas" element={<ProtectedRoute><PortariaList /></ProtectedRoute>} />
                
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </Suspense>
          </DndProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
