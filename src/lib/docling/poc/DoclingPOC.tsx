import { DocumentConverter, HybridChunker } from 'docling';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProcessingMetrics {
  file: string;
  processingTime: number;
  cpuUsage: number;
  ramUsage: number;
  numChunks: number;
  docSize: number;
}

export class DoclingPOC {
  private converter: DocumentConverter;
  private chunker: HybridChunker;
  private results: ProcessingMetrics[] = [];

  constructor() {
    this.converter = new DocumentConverter();
    this.chunker = new HybridChunker();
  }

  async processDocument(file: File): Promise<ProcessingMetrics> {
    console.log('Processing document:', file.name);
    
    const startTime = performance.now();

    try {
      // Convert document
      const result = await this.converter.convert(file);
      console.log('Document converted successfully');

      // Generate chunks
      const chunks = Array.from(this.chunker.chunk(result.document));
      console.log('Generated chunks:', chunks.length);

      // Calculate metrics
      const processingTime = performance.now() - startTime;
      
      const metrics: ProcessingMetrics = {
        file: file.name,
        processingTime,
        cpuUsage: 0, // Browser doesn't provide CPU metrics
        ramUsage: 0, // Browser doesn't provide RAM metrics
        numChunks: chunks.length,
        docSize: result.document.export_to_markdown().length
      };

      this.results.push(metrics);
      return metrics;

    } catch (error) {
      console.error('Error processing document:', error);
      toast.error(`Error processing ${file.name}`);
      throw error;
    }
  }

  async uploadResults() {
    try {
      const { error } = await supabase
        .from('docling_poc_results')
        .insert(this.results);

      if (error) throw error;
      
      console.log('POC results uploaded successfully');
      toast.success('POC results saved');
      
    } catch (error) {
      console.error('Error uploading POC results:', error);
      toast.error('Failed to save POC results');
    }
  }

  getResults() {
    return this.results;
  }
}