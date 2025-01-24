import * as React from "react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const RNCHome = () => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  // Example data
  const exampleData = [
    {
      number: "RNC-001",
      company: "Empresa A",
      type: "Reclamação do Cliente",
      status: "Pendente",
      department: "Qualidade",
      date: "2024-03-15",
    },
    {
      number: "RNC-002",
      company: "Empresa B",
      type: "Fornecedor",
      status: "Coletado",
      department: "Logística",
      date: "2024-03-14",
    },
    {
      number: "RNC-003",
      company: "Empresa C",
      type: "Logística",
      status: "Solucionado",
      department: "Financeiro",
      date: "2024-03-13",
    },
    {
      number: "RNC-004",
      company: "Empresa D",
      type: "Expedição",
      status: "Cancelado",
      department: "Qualidade",
      date: "2024-03-12",
    },
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      Pendente: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
      Cancelado: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
      Coletado: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
      Solucionado: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getTypeColor = (type: string) => {
    const colors = {
      "Reclamação do Cliente": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
      "Fornecedor": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100",
      "Expedição": "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-100",
      "Logística": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-100",
      "Representante": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
      "Motorista": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100",
      "Financeiro": "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-100",
      "Comercial": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-100",
      "Acordo Financeiro": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getDepartmentColor = (department: string) => {
    const colors = {
      "Logística": "bg-amber-50 text-amber-800 dark:bg-amber-900 dark:text-amber-100",
      "Qualidade": "bg-yellow-50 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
      "Financeiro": "bg-orange-50 text-orange-800 dark:bg-orange-900 dark:text-orange-100",
    };
    return colors[department as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        Registros de Não Conformidades (RNCs)
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Gerencie as não conformidades cadastradas no portal
      </p>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 flex gap-4">
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full md:w-[200px] bg-white dark:bg-gray-800">
              <SelectValue placeholder="Selecione um status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
              <SelectItem value="coletado">Coletado</SelectItem>
              <SelectItem value="solucionado">Solucionado</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full md:w-[200px] bg-white dark:bg-gray-800">
              <SelectValue placeholder="Selecione um tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="reclamacao">Reclamação do Cliente</SelectItem>
              <SelectItem value="fornecedor">Fornecedor</SelectItem>
              <SelectItem value="expedicao">Expedição</SelectItem>
              <SelectItem value="logistica">Logística</SelectItem>
              <SelectItem value="representante">Representante</SelectItem>
              <SelectItem value="motorista">Motorista</SelectItem>
              <SelectItem value="financeiro">Financeiro</SelectItem>
              <SelectItem value="comercial">Comercial</SelectItem>
              <SelectItem value="acordo">Acordo Financeiro</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-full md:w-[200px] bg-white dark:bg-gray-800">
              <SelectValue placeholder="Selecione um departamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="logistica">Logística</SelectItem>
              <SelectItem value="qualidade">Qualidade</SelectItem>
              <SelectItem value="financeiro">Financeiro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <div className={cn(
            "transition-all duration-300 flex items-center gap-2",
            isSearchExpanded ? "w-full md:w-[400px]" : "w-10"
          )}>
            {isSearchExpanded ? (
              <>
                <Input
                  type="text"
                  placeholder="Pesquise uma RNC (Número, Empresa, ...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white dark:bg-gray-800"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setIsSearchExpanded(false);
                    setSearchQuery("");
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchExpanded(true)}
              >
                <Search className="h-4 w-4" />
              </Button>
            )}
          </div>

          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            + Nova RNC
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead>Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exampleData.map((rnc, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{rnc.number}</TableCell>
                <TableCell>{rnc.company}</TableCell>
                <TableCell>
                  <Badge className={getTypeColor(rnc.type)}>{rnc.type}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(rnc.status)}>{rnc.status}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getDepartmentColor(rnc.department)}>{rnc.department}</Badge>
                </TableCell>
                <TableCell>{new Date(rnc.date).toLocaleDateString('pt-BR')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RNCHome;