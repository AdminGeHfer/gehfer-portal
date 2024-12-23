import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DoclingPOC } from '@/lib/docling/poc/DoclingPOC';
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";

export function DoclingPOCUI() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [poc, setPoc] = useState<DoclingPOC | null>(null);

  useEffect(() => {
    const initializePOC = async () => {
      try {
        const newPoc = new DoclingPOC();
        await newPoc.initialize();
        setPoc(newPoc);
        setIsInitialized(true);
      } catch (error: any) {
        console.error('Error initializing POC:', error);
        toast.error(error.message || 'Failed to initialize document processing');
      }
    };

    initializePOC();
  }, []);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !poc) return;

    setIsProcessing(true);
    try {
      for (const file of Array.from(files)) {
        const metrics = await poc.processDocument(file);
        setResults(prev => [...prev, metrics]);
      }
      
      await poc.uploadResults();
      toast.success('Documents processed successfully');
      
    } catch (error: any) {
      console.error('Error in POC:', error);
      toast.error(error.message || 'Error processing documents');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isInitialized) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <p>Initializing document processing...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">Docling POC</h2>
          <p className="text-muted-foreground mb-4">
            Test document processing with Docling integration
          </p>
        </div>

        <div className="space-y-4">
          <Button
            disabled={isProcessing}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            {isProcessing ? 'Processing...' : 'Select Documents'}
          </Button>
          
          <input
            id="file-input"
            type="file"
            multiple
            accept=".pdf,.docx,.doc,.pptx,.ppt"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>

        {results.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Results</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File</TableHead>
                  <TableHead>Processing Time (ms)</TableHead>
                  <TableHead>Chunks</TableHead>
                  <TableHead>Doc Size</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result, index) => (
                  <TableRow key={index}>
                    <TableCell>{result.file}</TableCell>
                    <TableCell>{result.processingTime.toFixed(2)}</TableCell>
                    <TableCell>{result.numChunks}</TableCell>
                    <TableCell>{result.docSize}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </Card>
  );
}