import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";

const Settings = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="Configurações" 
        subtitle="Personalize sua experiência com IA" 
      />
      
      <main className="container mx-auto px-4 py-8">
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-primary/10 rounded-full">
              <SettingsIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Configurações Gerais</h2>
              <p className="text-muted-foreground">
                Personalize as configurações do seu ambiente de IA
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <p className="text-center text-muted-foreground">
              Configurações em desenvolvimento. Em breve você poderá personalizar sua experiência.
            </p>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Settings;