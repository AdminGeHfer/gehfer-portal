import html2pdf from 'html2pdf.js';
import { toast } from 'sonner';

interface GeneratePDFOptions {
  filename: string;
  element: HTMLElement;
}

export const generatePDF = async ({ filename, element }: GeneratePDFOptions) => {
  console.log('Starting PDF generation...');
  
  const options = {
    margin: [5, 5],
    filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      logging: true,
      windowWidth: 1024,
      windowHeight: 768,
      scrollY: -window.scrollY,
      scrollX: -window.scrollX,
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait',
      compress: true
    },
    pagebreak: { mode: 'avoid-all' }
  };

  try {
    // Use a Promise to handle the PDF generation
    await new Promise((resolve, reject) => {
      html2pdf()
        .set(options)
        .from(element)
        .save()
        .then(() => {
          console.log('PDF generation completed successfully');
          resolve(true);
        })
        .catch(reject);
    });
    
    toast.success("PDF gerado com sucesso!");
  } catch (error) {
    console.error('Error generating PDF:', error);
    toast.error(`Erro ao gerar PDF: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    throw error;
  }
};