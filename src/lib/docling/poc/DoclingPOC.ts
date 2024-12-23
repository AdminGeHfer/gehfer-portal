import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ProcessingMetrics, DocumentChunk } from './types';
import { OpenAIService } from './services/openai-service';
import { DocumentService } from './services/document-service';

export class DoclingPOC {
  private openAIService: OpenAIService;
  private documentService: DocumentService;
  private results: ProcessingMetrics[] = [];
  private chunks: DocumentChunk[] = [];
  private initialized: boolean = false;

  constructor() {
    this.openAIService = new OpenAIService();
    this.documentService = new DocumentService();
  }

  async initialize() {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) throw sessionError;
      if (!session) throw new Error('No active session');

      await this.openAIService.initialize();
      this.initialized = true;
    } catch (error: any) {
      console.error('Initialization error:', error);
      throw new Error('Failed to initialize document processing. Please ensure you are logged in.');
    }
  }

  private convertToVectorString(embedding: number[]): string {
    return `[${embedding.join(',')}]`;
  }

  async processDocument(file: File): Promise<ProcessingMetrics> {
    if (!this.initialized) {
      throw new Error('DoclingPOC not initialized. Please wait for initialization to complete.');
    }

    console.log('Processing document:', file.name);
    
    const startTime = performance.now();

    try {
      const { chunks, docSize } = await this.documentService.processDocument(file);

      // Generate embeddings for each chunk
      for (const chunk of chunks) {
        chunk.embedding = await this.openAIService.generateEmbedding(chunk.content);
      }
      console.log('Generated embeddings for all chunks');

      // Store chunks for later saving
      this.chunks = this.chunks.concat(chunks);

      // Calculate metrics
      const processingTime = performance.now() - startTime;
      
      const metrics: ProcessingMetrics = {
        file: file.name,
        processingTime,
        cpuUsage: 0,
        ramUsage: 0,
        numChunks: chunks.length,
        docSize
      };

      this.results.push(metrics);
      return metrics;

    } catch (error: any) {
      console.error('Error processing document:', error);
      throw error;
    }
  }

  async uploadResults() {
    if (!this.initialized) {
      throw new Error('DoclingPOC not initialized. Please wait for initialization to complete.');
    }

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
      const { error: resultsError } = await supabase
        .from('docling_poc_results')
        .insert(this.results.map(result => ({
          file: result.file,
          processing_time: result.processingTime,
          cpu_usage: result.cpuUsage || null,
          ram_usage: result.ramUsage || null,
          num_chunks: result.numChunks,
          doc_size: result.docSize
        })));

      if (resultsError) throw resultsError;
      
      console.log('POC results uploaded successfully');
      
    } catch (error: any) {
      console.error('Error uploading results:', error);
      throw new Error('Failed to save processing results: ' + error.message);
    }
  }

  getResults() {
    return this.results;
  }
}