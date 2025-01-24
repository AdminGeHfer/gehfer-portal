import React, { useState } from "react";
import { CreateRNCModal } from "@/components/rnc/CreateRNCModal";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/molecules/SearchInput";
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
import Subtitle from "@/components/quality/form/Subtitle";

const RNCHome = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  // Sample data for the table
  const rncs = [
    {
      id: 1,
      number: "RNC-001",
      company: "Empresa A",
      type: "Reclamação",
      status: "Em análise",
      department: "Qualidade",
      date: "2024-03-20",
    },
    {
      id: 2,
      number: "RNC-002",
      company: "Empresa B",
      type: "Não conformidade",
      status: "Pendente",
      department: "Produção",
      date: "2024-03-19",
    },
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestão de RNCs</h1>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Criar RNC
        </Button>
      </div>

      <div className="mb-6">
        <Subtitle text="Filtros" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar por Número, Empresa..."
          />
          
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="analysis">Em análise</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="resolved">Resolvido</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger>
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="complaint">Reclamação</SelectItem>
              <SelectItem value="nonconformity">Não conformidade</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger>
              <SelectValue placeholder="Departamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="quality">Qualidade</SelectItem>
              <SelectItem value="production">Produção</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
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
            {rncs.map((rnc) => (
              <TableRow key={rnc.id}>
                <TableCell>{rnc.number}</TableCell>
                <TableCell>{rnc.company}</TableCell>
                <TableCell>{rnc.type}</TableCell>
                <TableCell>{rnc.status}</TableCell>
                <TableCell>{rnc.department}</TableCell>
                <TableCell>{rnc.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CreateRNCModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default RNCHome;