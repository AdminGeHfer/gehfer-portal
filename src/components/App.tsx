import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AuthGuard } from "@/components/auth/AuthGuard";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { CollapsibleSidebar } from "@/components/layout/CollapsibleSidebar";
import { SidebarNav } from "@/components/layout/SidebarNav";

const Login = lazy(() => import("@/pages/Login"));
const Apps = lazy(() => import("@/pages/Apps"));
const QualityRoutes = lazy(() => import("@/routes/QualityRoutes"));
const AdminRoutes = lazy(() => import("@/routes/AdminRoutes"));
const PortariaRoutes = lazy(() => import("@/routes/PortariaRoutes"));
const IntelligenceRoutes = lazy(() => import("@/routes/IntelligenceRoutes"));

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
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
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

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <DndProvider backend={HTML5Backend}>
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
          </DndProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
