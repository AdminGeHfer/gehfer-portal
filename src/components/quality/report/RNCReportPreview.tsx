import { useRef } from "react";
import { RNCReport } from "./RNCReport";
import { generatePDF } from "@/utils/pdfUtils";
import { RNC } from "@/types/rnc";
import { toast } from "sonner";

interface RNCReportPreviewProps {
  rnc: RNC;
  onClose: () => void;
}

export function RNCReportPreview({ rnc, onClose }: RNCReportPreviewProps) {
  const reportRef = useRef<HTMLDivElement>(null);

  const handleGeneratePDF = async () => {
    try {
      if (!reportRef.current) {
        console.error('Report element not found in DOM');
        toast.error("Erro ao gerar PDF: elemento não encontrado");
        return;
      }

      await generatePDF({
        filename: `RNC-${rnc.rnc_number}.pdf`,
        element: reportRef.current
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      onClose();
    }
  };

  // Generate PDF automatically when component mounts
  setTimeout(handleGeneratePDF, 100);

  return (
    <div id="rnc-report" ref={reportRef} className="p-4 bg-background text-foreground print:bg-white print:text-black">
      <RNCReport rnc={rnc} />
    </div>
  );
}