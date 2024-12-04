import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Mail, Phone, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const services = [
  {
    id: "1",
    date: "20/02/2024",
    service: "Corte de Cabelo",
    professional: "Ana Paula",
    value: "R$ 150,00"
  },
  {
    id: "2",
    date: "15/01/2024",
    service: "Coloração",
    professional: "Mariana",
    value: "R$ 350,00"
  }
];

const CustomerDetails = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/app/crm/customers")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold">Maria Silva</h1>
          </div>
          <p className="text-muted-foreground">Detalhes do cliente</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.location.href = "mailto:maria@email.com"}>
            <Mail className="mr-2 h-4 w-4" />
            Enviar Email
          </Button>
          <Button variant="outline" onClick={() => window.location.href = "tel:(11) 99999-9999"}>
            <Phone className="mr-2 h-4 w-4" />
            Ligar
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p>maria@email.com</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Telefone</p>
              <p>(11) 99999-9999</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Estatísticas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">Total Gasto</p>
              <p className="text-2xl font-bold">R$ 1.250,00</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Visitas</p>
              <p className="text-2xl font-bold">8</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Última Visita</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">Data</p>
              <p>20/02/2024</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Serviço</p>
              <p>Corte de Cabelo</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Serviços</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Serviço</TableHead>
                <TableHead>Profissional</TableHead>
                <TableHead>Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>{service.date}</TableCell>
                  <TableCell>{service.service}</TableCell>
                  <TableCell>{service.professional}</TableCell>
                  <TableCell>{service.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerDetails;