import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Header } from "@/components/layout/Header";

const Chat = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="Chat Lobe" 
        subtitle="Interface moderna de chat com IA usando Lobe Chat" 
      />
      
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<LoadingSpinner />}>
          <div className="flex flex-col space-y-4">
            <div className="p-4 bg-primary/10 rounded-lg">
              <p className="text-center text-muted-foreground">
                Chat em desenvolvimento. Em breve você poderá interagir com nossos agentes de IA.
              </p>
            </div>
          </div>
        </Suspense>
      </main>
    </div>
  );
};

export default Chat;