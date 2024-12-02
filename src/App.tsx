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
import { RoleGuard } from "./components/auth/RoleGuard";

// Lazy loaded components
const Login = lazy(() => import("./pages/Login"));
const Apps = lazy(() => import("./pages/Apps"));
const QualityRoutes = lazy(() => import("./routes/QualityRoutes"));
const AdminRoutes = lazy(() => import("./routes/AdminRoutes"));
const PortariaRoutes = lazy(() => import("./routes/PortariaRoutes"));

// Configure QueryClient with performance optimizations
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 60, // 1 hour
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false
    },
  },
});

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
  </div>
);

const ProtectedRoute = ({ children, module, action = "read" }: { 
  children: React.ReactNode;
  module: string;
  action?: string;
}) => (
  <AuthGuard>
    <RoleGuard module={module} action={action}>
      {children}
    </RoleGuard>
  </AuthGuard>
);

const App = () => {
  return (
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
                  <Route path="/apps" element={<ProtectedRoute module="any"><Apps /></ProtectedRoute>} />
                  
                  {/* Quality Module Routes */}
                  <Route path="/quality/*" element={
                    <ProtectedRoute module="quality">
                      <QualityRoutes />
                    </ProtectedRoute>
                  } />
                  
                  {/* Admin Module Routes */}
                  <Route path="/admin/*" element={
                    <ProtectedRoute module="admin">
                      <AdminRoutes />
                    </ProtectedRoute>
                  } />
                  
                  {/* Portaria Module Routes */}
                  <Route path="/portaria/*" element={
                    <ProtectedRoute module="portaria">
                      <PortariaRoutes />
                    </ProtectedRoute>
                  } />
                  
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
};

export default App;