import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RNC } from "@/types/rnc";
import { Phone, Mail, User } from "lucide-react";

interface RNCContactInfoProps {
  rnc: RNC;
}

export function RNCContactInfo({ rnc }: RNCContactInfoProps) {
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Informações de Contato</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nome</p>
              <p className="text-lg">{rnc.contact.name}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Telefone</p>
              <p className="text-lg">{rnc.contact.phone}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-lg">{rnc.contact.email}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}