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

  async initialize(): Promise<boolean> {
    try {
      console.log('Initializing DoclingPOC...');
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        throw sessionError;
      }
      
      if (!session) {
        console.error('No active session');
        throw new Error('No active session');
      }

      console.log('Session verified, initializing OpenAI service...');
      
      const openAIInitialized = await this.openAIService.initialize();
      if (!openAIInitialized) {
        console.error('Failed to initialize OpenAI service');
        throw new Error('Failed to initialize OpenAI service. Please check your API key.');
      }

      console.log('DoclingPOC initialized successfully');
      this.initialized = true;
      return true;
    } catch (error: any) {
      console.error('Initialization error:', error);
      throw new Error('Failed to initialize document processing. Please ensure you are logged in and have set up your OpenAI API key.');
    }
  }

  private convertToVectorString(embedding: number[]): string {
    return `[${embedding.join(',')}]`;
  }

  async processDocument(file: File): Promise<ProcessingMetrics> {
    if (!this.initialized) {
      console.error('DoclingPOC not initialized');
      throw new Error('DoclingPOC not initialized. Please wait for initialization to complete.');
    }

    console.log('Processing document:', file.name);
    
    const startTime = performance.now();

    try {
      const { chunks, docSize } = await this.documentService.processDocument(file);
      console.log(`Document processed into ${chunks.length} chunks`);

      // Generate embeddings for each chunk
      for (const chunk of chunks) {
        chunk.embedding = await this.openAIService.generateEmbedding(chunk.content);
        console.log(`Generated embedding for chunk ${chunks.indexOf(chunk) + 1}/${chunks.length}`);
      }

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
      console.log('Document processing completed:', metrics);
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
      console.log('Uploading results...');
      
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