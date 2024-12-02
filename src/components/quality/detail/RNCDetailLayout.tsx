import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { RNCDetailHeader } from "./RNCDetailHeader";
import { RNCDetailForm } from "./RNCDetailForm";
import { RNCCommentSection } from "./RNCCommentSection";
import { RNCAttachments } from "./RNCAttachments";
import { RNCWorkflowStatus } from "../workflow/RNCWorkflowStatus";
import { BackButton } from "@/components/atoms/BackButton";
import { useParams } from "react-router-dom";

export const RNCDetailLayout = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <BackButton to="/quality/rnc" label="Voltar para Lista de RNCs" />
        
        <div className="space-y-8">
          <Card className="p-6">
            <RNCDetailHeader rncId={id} />
          </Card>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2 space-y-8">
              <Card className="p-6">
                <RNCDetailForm rncId={id} />
              </Card>

              <Card className="p-6">
                <RNCAttachments rncId={id} />
              </Card>

              <Card className="p-6">
                <RNCCommentSection rncId={id} />
              </Card>
            </div>

            <div className="space-y-8">
              <Card className="p-6">
                <RNCWorkflowStatus rncId={id} />
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RNCDetailLayout;
