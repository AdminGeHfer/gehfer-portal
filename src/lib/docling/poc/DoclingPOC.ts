import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import OpenAI from 'openai';

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
  embedding?: number[];
}

interface DocumentConverter {
  convert: (file: File) => Promise<{
    document: {
      export_to_markdown: () => string;
    };
  }>;
}

interface DocumentChunker {
  chunk: (doc: { export_to_markdown: () => string }) => DocumentChunk[];
}

export class DoclingPOC {
  private converter: DocumentConverter;
  private chunker: DocumentChunker;
  private results: ProcessingMetrics[] = [];
  private chunks: DocumentChunk[] = [];
  private openai: OpenAI;

  constructor() {
    // Initialize OpenAI client
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Simulated for POC since we can't directly use docling in browser
    this.converter = {
      convert: async (file: File) => ({
        document: {
          export_to_markdown: () => 'Processed content for ' + file.name
        }
      })
    };
    
    this.chunker = {
      chunk: (doc: { export_to_markdown: () => string }) => {
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

  private async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.openai.embeddings.create({
        input: text,
        model: "text-embedding-3-small"
      });
      return response.data[0].embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw error;
    }
  }

  // Convert number[] to PostgreSQL vector format
  private convertToVectorString(embedding: number[]): string {
    return `[${embedding.join(',')}]`;
  }

  async processDocument(file: File): Promise<ProcessingMetrics> {
    console.log('Processing document:', file.name);
    
    const startTime = performance.now();

    try {
      // Convert document
      const result = await this.converter.convert(file);
      console.log('Document converted successfully');

      // Generate chunks
      const documentChunks = this.chunker.chunk(result.document);
      console.log('Generated chunks:', documentChunks.length);

      // Generate embeddings for each chunk
      for (const chunk of documentChunks) {
        chunk.embedding = await this.generateEmbedding(chunk.content);
      }
      console.log('Generated embeddings for all chunks');

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

      // Then save all chunks with their embeddings
      const chunksToInsert = this.chunks.map(chunk => ({
        document_id: documentData.id,
        content: chunk.content,
        embedding: chunk.embedding ? this.convertToVectorString(chunk.embedding) : null,
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