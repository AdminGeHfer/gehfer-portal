import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Search, MoreHorizontal, Pencil, Trash, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { CustomerForm } from "@/components/crm/CustomerForm";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastVisit: string;
  totalSpent: string;
}

const initialCustomers: Customer[] = [
  {
    id: "1",
    name: "Maria Silva",
    email: "maria@email.com",
    phone: "(11) 99999-9999",
    lastVisit: "2024-02-20",
    totalSpent: "R$ 1.250,00"
  },
  {
    id: "2",
    name: "João Santos",
    email: "joao@email.com",
    phone: "(11) 88888-8888",
    lastVisit: "2024-02-15",
    totalSpent: "R$ 850,00"
  }
];

const Customers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const handleDeleteCustomer = (customerId: string) => {
    setCustomers(prev => prev.filter(c => c.id !== customerId));
    toast({
      title: "Cliente removido",
      description: "O cliente foi removido com sucesso."
    });
  };

  const handleAddCustomer = (customer: Omit<Customer, "id" | "lastVisit" | "totalSpent">) => {
    const newCustomer: Customer = {
      id: `customer-${Date.now()}`,
      lastVisit: new Date().toISOString().split('T')[0],
      totalSpent: "R$ 0,00",
      ...customer
    };
    setCustomers(prev => [...prev, newCustomer]);
    toast({
      title: "Cliente adicionado",
      description: "O cliente foi adicionado com sucesso."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clientes</h1>
          <p className="text-muted-foreground">
            Gerencie sua base de clientes
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <CustomerForm onSubmit={handleAddCustomer} />
        </Dialog>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar clientes..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Última Visita</TableHead>
              <TableHead>Total Gasto</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.lastVisit}</TableCell>
                <TableCell>{customer.totalSpent}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => navigate(`/app/crm/customers/${customer.id}`)}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Detalhes
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => window.location.href = `mailto:${customer.email}`}>
                        <Mail className="mr-2 h-4 w-4" />
                        Enviar Email
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => window.location.href = `tel:${customer.phone}`}>
                        <Phone className="mr-2 h-4 w-4" />
                        Ligar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => handleDeleteCustomer(customer.id)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Customers;