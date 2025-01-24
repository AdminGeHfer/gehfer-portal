import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export const ComplaintHeader = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  return (
    <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Dashboard</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => navigate("/new-complaint")}
              className="btn-primary"
            >
              Nova Reclamação
            </button>
            <button
              onClick={() => navigate("/login")}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors px-4"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};