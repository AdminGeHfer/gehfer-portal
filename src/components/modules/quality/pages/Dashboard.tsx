import { Header } from "@/components/layout/Header";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { getRNCs } from "@/api/rnc";
import { RNC } from "@/types/rnc";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [rncs, setRncs] = useState<RNC[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRncs = async () => {
      try {
        const data = await getRNCs();
        setRncs(data);
      } catch {
        toast({
          title: "Erro ao carregar RNCs",
          description: "Não foi possível carregar os dados das RNCs.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRncs();
  }, [toast]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Dashboard de Qualidade" />
      
      <div className="container mx-auto px-4 py-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/apps")}
          className="mb-6"
        >
          Voltar para Apps
        </Button>

        <div className="grid gap-6">
          <Card>
            <CardContent className="pt-6">
              <CardTitle className="text-xl mb-4">RNCs Recentes</CardTitle>
              {loading ? (
                <p>Carregando...</p>
              ) : (
                <ul className="space-y-4">
                  {rncs.map((rnc) => (
                    <li key={rnc.id} className="border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{rnc.title}</h3>
                          <p className="text-sm text-muted-foreground">{rnc.description}</p>
                        </div>
                        <Button 
                          variant="outline"
                          onClick={() => navigate(`/quality/rnc/${rnc.id}`)}
                        >
                          Ver Detalhes
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;