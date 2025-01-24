import { useState } from "react";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ComplaintFilters } from "@/components/dashboard/ComplaintFilters";
import { ComplaintDetails } from "@/components/dashboard/ComplaintDetails";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [complaints] = useState([
    {
      id: 1,
      date: "2024-03-20",
      company: "Empresa ABC",
      status: "Em análise",
      description: "Problema com entrega do material",
      protocol: "1001",
      daysOpen: 3,
      rootCause: "",
      solution: "",
    },
    {
      id: 2,
      date: "2024-03-19",
      company: "Empresa XYZ",
      status: "Pendente",
      description: "Material com defeito",
      protocol: "1002",
      daysOpen: 4,
      rootCause: "",
      solution: "",
    },
  ]);

  const [selectedComplaint, setSelectedComplaint] = useState<number | null>(null);
  const [filters, setFilters] = useState({
    protocol: "",
    date: "",
    company: "",
    status: "",
    daysOpen: "",
  });

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const filteredComplaints = complaints.filter((complaint) => {
    const searchTerms = {
      protocol: filters.protocol.toLowerCase(),
      date: filters.date.toLowerCase(),
      company: filters.company.toLowerCase(),
    };

    // If no filters are active, show all complaints
    if (!Object.values(searchTerms).some(term => term !== "")) {
      return true;
    }

    // Check each field individually
    const matchesProtocol = !searchTerms.protocol || complaint.protocol.toLowerCase().includes(searchTerms.protocol);
    const matchesDate = !searchTerms.date || complaint.date.toLowerCase().includes(searchTerms.date);
    const matchesCompany = !searchTerms.company || complaint.company.toLowerCase().includes(searchTerms.company);

    // Return true if any field matches (OR condition)
    return matchesProtocol || matchesDate || matchesCompany;
  });

  const handleStatusUpdate = (complaintId: number, newStatus: string) => {
    toast.success(`Status atualizado para: ${newStatus}`);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-gray-900">
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

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="glass-card p-8 animate-scale-in dark:bg-gray-800/50">
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
              Minhas Reclamações
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="glass-card p-6 text-center dark:bg-gray-700/50">
                <div className="text-3xl font-semibold text-primary mb-2">
                  {complaints.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
              </div>
              <div className="glass-card p-6 text-center dark:bg-gray-700/50">
                <div className="text-3xl font-semibold text-warning mb-2">2</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Em Análise</div>
              </div>
              <div className="glass-card p-6 text-center dark:bg-gray-700/50">
                <div className="text-3xl font-semibold text-success mb-2">1</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Resolvidas</div>
              </div>
              <div className="glass-card p-6 text-center dark:bg-gray-700/50">
                <div className="text-3xl font-semibold text-error mb-2">1</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Pendentes</div>
              </div>
            </div>
          </div>

          <ComplaintFilters filters={filters} onFilterChange={handleFilterChange} />

          <div className="overflow-hidden rounded-xl border border-gray-200/50 dark:border-gray-700/50">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50 dark:bg-gray-800/50">
                  <TableHead className="font-medium dark:text-gray-300">Protocolo</TableHead>
                  <TableHead className="font-medium dark:text-gray-300">Data</TableHead>
                  <TableHead className="font-medium dark:text-gray-300">Empresa</TableHead>
                  <TableHead className="font-medium dark:text-gray-300">Status</TableHead>
                  <TableHead className="font-medium dark:text-gray-300">Dias em Aberto</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredComplaints.map((complaint) => (
                  <TableRow
                    key={complaint.id}
                    className="cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors"
                    onClick={() => setSelectedComplaint(complaint.id)}
                  >
                    <TableCell className="font-medium dark:text-gray-200">{complaint.protocol}</TableCell>
                    <TableCell className="dark:text-gray-200">
                      {new Date(complaint.date).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell className="dark:text-gray-200">{complaint.company}</TableCell>
                    <TableCell>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          complaint.status === "Em análise"
                            ? "bg-warning/10 text-warning-dark dark:bg-warning/20"
                            : "bg-error/10 text-error-dark dark:bg-error/20"
                        }`}
                      >
                        {complaint.status}
                      </span>
                    </TableCell>
                    <TableCell className="dark:text-gray-200">{complaint.daysOpen} dias</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {selectedComplaint && (
            <ComplaintDetails
              complaint={complaints.find((c) => c.id === selectedComplaint)!}
              onStatusUpdate={handleStatusUpdate}
              onClose={() => setSelectedComplaint(null)}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
