import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ProcessingMetrics {
  file: string;
  processingTime: number;
  cpuUsage: number;
  ramUsage: number;
  numChunks: number;
  docSize: number;
}

interface DoclingPocResult {
  file: string;
  processing_time: number;
  cpu_usage: number | null;
  ram_usage: number | null;
  num_chunks: number;
  doc_size: number;
}

export class DoclingPOC {
  private converter: any;
  private chunker: any;
  private results: ProcessingMetrics[] = [];

  constructor() {
    // Simulated for POC since we can't directly use docling in browser
    this.converter = {
      convert: async (file: File) => ({
        document: {
          export_to_markdown: () => 'Processed content'
        }
      })
    };
    this.chunker = {
      chunk: (doc: any) => Array(Math.floor(Math.random() * 10 + 5)).fill('Chunk')
    };
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
      // Map results to match database schema
      const dbResults: DoclingPocResult[] = this.results.map(result => ({
        file: result.file,
        processing_time: result.processingTime,
        cpu_usage: result.cpuUsage || null,
        ram_usage: result.ramUsage || null,
        num_chunks: result.numChunks,
        doc_size: result.docSize
      }));

      const { error } = await supabase
        .from('docling_poc_results')
        .insert(dbResults);

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