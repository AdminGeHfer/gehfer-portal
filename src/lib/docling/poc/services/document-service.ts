import { DocumentConverter, DocumentChunker, DocumentChunk } from '../types';

export class DocumentService {
  private converter: DocumentConverter;
  private chunker: DocumentChunker;

  constructor() {
    this.converter = {
      convert: async (file: File) => ({
        document: {
          export_to_markdown: () => 'Processed content for ' + file.name
        }
      })
    };
    
    this.chunker = {
      chunk: (doc: { export_to_markdown: () => string }) => {
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

  async processDocument(file: File): Promise<{
    chunks: DocumentChunk[];
    docSize: number;
  }> {
    const result = await this.converter.convert(file);
    const chunks = this.chunker.chunk(result.document);
    const docSize = result.document.export_to_markdown().length;
    
    return { chunks, docSize };
  }
}