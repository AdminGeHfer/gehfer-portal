import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Apps from "./pages/Apps";
import RNCList from "./pages/quality/RNCList";
import RNCDetail from "./pages/quality/RNCDetail";
import Dashboard from "./pages/quality/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/apps" element={<Apps />} />
          <Route path="/" element={<Index />} />
          <Route path="/quality" element={<Navigate to="/quality/dashboard" replace />} />
          <Route path="/quality/dashboard" element={<Dashboard />} />
          <Route path="/quality/rnc" element={<RNCList />} />
          <Route path="/quality/rnc/:id" element={<RNCDetail />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;