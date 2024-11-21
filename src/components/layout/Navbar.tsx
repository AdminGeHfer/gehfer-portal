import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <h1 className="text-2xl font-heading font-bold text-primary">GeHfer</h1>
          <div className="hidden md:flex space-x-6">
            <Button variant="ghost" onClick={() => navigate("/")}>Dashboard</Button>
            <Button variant="ghost" onClick={() => navigate("/rncs")}>RNCs</Button>
            <Button variant="ghost" onClick={() => navigate("/admin")}>Administração</Button>
          </div>
        </div>
        <Button variant="outline" onClick={() => navigate("/login")}>Login</Button>
      </div>
    </nav>
  );
}