import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Login from "./pages/Login";
import Apps from "./pages/Apps";
import RNCList from "./pages/quality/RNCList";
import RNCDetail from "./pages/quality/RNCDetail";
import Dashboard from "./pages/quality/Dashboard";
import Users from "./pages/admin/Users";
import AccessControl from "./pages/portaria/AccessControl";
import PortariaList from "./pages/portaria/PortariaList";
import PendingDeliveries from "./pages/portaria/PendingDeliveries";
import { AuthGuard } from "./components/auth/AuthGuard";

const queryClient = new QueryClient();

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
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/apps" element={<ProtectedRoute><Apps /></ProtectedRoute>} />
              
              {/* Quality Routes */}
              <Route path="/quality" element={<Navigate to="/quality/dashboard" replace />} />
              <Route path="/quality/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/quality/rnc" element={<ProtectedRoute><RNCList /></ProtectedRoute>} />
              <Route path="/quality/rnc/:id" element={<ProtectedRoute><RNCDetail /></ProtectedRoute>} />
              
              {/* Admin Routes */}
              <Route path="/admin/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
              
              {/* Portaria Routes */}
              <Route path="/portaria" element={<Navigate to="/portaria/acesso" replace />} />
              <Route path="/portaria/acesso" element={<ProtectedRoute><AccessControl /></ProtectedRoute>} />
              <Route path="/portaria/filas" element={<ProtectedRoute><PortariaList /></ProtectedRoute>} />
              <Route path="/portaria/entregas-pendentes" element={<ProtectedRoute><PendingDeliveries /></ProtectedRoute>} />
              
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </DndProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;