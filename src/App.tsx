import React, { Suspense, lazy, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthGuard } from "./components/auth/AuthGuard";
import { RoleGuard } from "./components/auth/RoleGuard";
import { SidebarProvider } from "./contexts/SidebarContext";
import { CollapsibleSidebar } from "./components/layout/CollapsibleSidebar";
import { SidebarNav } from "./components/layout/SidebarNav";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { supabase } from "@/integrations/supabase/client";

const Login = lazy(() => import("./features/auth/pages/Login").catch(err => {
  console.error("Error loading Login component:", err);
  return import("./components/pages/Login");
}));

const Apps = lazy(() => import("./pages/Apps").catch(err => {
  console.error("Error loading Apps component:", err);
  return Promise.reject(err);
}));

const QualityRoutes = lazy(() => import("./routes/QualityRoutes").catch(err => {
  console.error("Error loading QualityRoutes component:", err);
  return Promise.reject(err);
}));

const AdminRoutes = lazy(() => import("./routes/AdminRoutes").catch(err => {
  console.error("Error loading AdminRoutes component:", err);
  return Promise.reject(err);
}));

const PortariaRoutes = lazy(() => import("./routes/PortariaRoutes").catch(err => {
  console.error("Error loading PortariaRoutes component:", err);
  return Promise.reject(err);
}));

const IntelligenceRoutes = lazy(() => import("./routes/IntelligenceRoutes").catch(err => {
  console.error("Error loading IntelligenceRoutes component:", err);
  return Promise.reject(err);
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 60,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false
    },
  },
});

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <LoadingSpinner size="lg" />
  </div>
);

const ErrorFallback = ({ error }: { error: Error }) => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <h2 className="text-xl font-semibold mb-4">Error loading page</h2>
    <p className="text-muted-foreground">{error.message}</p>
  </div>
);

interface ProtectedRouteProps {
  children: React.ReactNode;
  module: string;
  action?: string;
}

const ProtectedRoute = ({ children, module, action = "read" }: ProtectedRouteProps) => (
  <AuthGuard>
    <RoleGuard module={module} action={action}>
      {children}
    </RoleGuard>
  </AuthGuard>
);

const App = () => {
  useEffect(() => {
    const checkSession = async () => {
      const { error } = await supabase.auth.getSession();
      if (error) console.error('Session error:', error);
    };
    
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      console.log('Auth state changed:', event);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TooltipProvider>
            <SidebarProvider>
              <div className="min-h-screen bg-background">
                <Toaster />
                <Sonner />
                <Suspense fallback={<LoadingFallback />}>
                  <div className="flex min-h-screen">
                    <Routes>
                      <Route path="/login" element={<Login />} />
                      <Route
                        path="/*"
                        element={
                          <ProtectedRoute module="any">
                            <>
                              <CollapsibleSidebar>
                                <SidebarNav />
                              </CollapsibleSidebar>
                              <main className="flex-1 overflow-auto w-full">
                                <Routes>
                                  <Route path="/apps" element={<Apps />} />
                                  <Route
                                    path="/intelligence/*"
                                    element={
                                      <ProtectedRoute module="intelligence">
                                        <IntelligenceRoutes />
                                      </ProtectedRoute>
                                    }
                                  />
                                  <Route
                                    path="/quality/*"
                                    element={
                                      <ProtectedRoute module="quality">
                                        <QualityRoutes />
                                      </ProtectedRoute>
                                    }
                                  />
                                  <Route
                                    path="/admin/*"
                                    element={
                                      <ProtectedRoute module="admin">
                                        <AdminRoutes />
                                      </ProtectedRoute>
                                    }
                                  />
                                  <Route
                                    path="/portaria/*"
                                    element={
                                      <ProtectedRoute module="portaria">
                                        <PortariaRoutes />
                                      </ProtectedRoute>
                                    }
                                  />
                                  <Route path="/" element={<Navigate to="/apps" replace />} />
                                  <Route path="*" element={<Navigate to="/apps" replace />} />
                                </Routes>
                              </main>
                            </>
                          </ProtectedRoute>
                        }
                      />
                    </Routes>
                  </div>
                </Suspense>
              </div>
            </SidebarProvider>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;