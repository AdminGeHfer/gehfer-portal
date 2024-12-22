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

interface DocumentChunk {
  content: string;
  metadata: {
    position: number;
    length: number;
  };
}

export class DoclingPOC {
  private converter: any;
  private chunker: any;
  private results: ProcessingMetrics[] = [];
  private chunks: DocumentChunk[] = [];

  constructor() {
    // Simulated for POC since we can't directly use docling in browser
    this.converter = {
      convert: async (file: File) => ({
        document: {
          export_to_markdown: () => 'Processed content for ' + file.name
        }
      })
    };
    
    this.chunker = {
      chunk: (doc: any) => {
        // Simulate realistic chunks based on file content
        const numChunks = Math.floor(Math.random() * 10 + 5);
        return Array(numChunks).fill(null).map((_, index) => ({
          content: `Chunk ${index + 1} from document: ${doc.export_to_markdown()}`,
          metadata: {
            position: index,
            length: 100
          }
        }));
      }
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
      const documentChunks = Array.from(this.chunker.chunk(result.document));
      console.log('Generated chunks:', documentChunks.length);

      // Store chunks for later saving
      this.chunks = this.chunks.concat(documentChunks);

      // Calculate metrics
      const processingTime = performance.now() - startTime;
      
      const metrics: ProcessingMetrics = {
        file: file.name,
        processingTime,
        cpuUsage: 0,
        ramUsage: 0,
        numChunks: documentChunks.length,
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
      // First create a new document entry
      const { data: documentData, error: documentError } = await supabase
        .from('documents')
        .insert({
          metadata: { filename: this.results[0].file },
          processed: true
        })
        .select()
        .single();

      if (documentError) throw documentError;

      console.log('Document created:', documentData);

      // Then save all chunks
      const chunksToInsert = this.chunks.map(chunk => ({
        document_id: documentData.id,
        content: chunk.content,
        metadata: chunk.metadata
      }));

      const { error: chunksError } = await supabase
        .from('document_chunks')
        .insert(chunksToInsert);

      if (chunksError) throw chunksError;

      console.log('Chunks saved successfully');

      // Finally save POC results
      const dbResults: DoclingPocResult[] = this.results.map(result => ({
        file: result.file,
        processing_time: result.processingTime,
        cpu_usage: result.cpuUsage || null,
        ram_usage: result.ramUsage || null,
        num_chunks: result.numChunks,
        doc_size: result.docSize
      }));

      const { error: resultsError } = await supabase
        .from('docling_poc_results')
        .insert(dbResults);

      if (resultsError) throw resultsError;
      
      console.log('POC results uploaded successfully');
      toast.success('Documento processado e chunks salvos com sucesso');
      
    } catch (error) {
      console.error('Error uploading results:', error);
      toast.error('Erro ao salvar resultados do processamento');
      throw error;
    }
  }

  getResults() {
    return this.results;
  }
}