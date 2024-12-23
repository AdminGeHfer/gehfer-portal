import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DoclingPOC } from '@/lib/docling/poc/DoclingPOC';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import { InitializationProgress } from './InitializationProgress';
import { InitializationError } from './components/InitializationError';
import { ResultsTable } from './components/ResultsTable';

const INITIALIZATION_STAGES = [
  { name: 'Checking authentication...', weight: 20 },
  { name: 'Creating POC instance...', weight: 20 },
  { name: 'Initializing OpenAI service...', weight: 40 },
  { name: 'Verifying configuration...', weight: 20 }
];

export function DoclingPOCUI() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [poc, setPoc] = useState<DoclingPOC | null>(null);
  const [initStage, setInitStage] = useState('Starting initialization...');
  const [initProgress, setInitProgress] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detailedError, setDetailedError] = useState<string | null>(null);
  const navigate = useNavigate();

  const updateProgress = (stageName: string, progress: number) => {
    setInitStage(stageName);
    setInitProgress(progress);
  };

  const initializePOC = async () => {
    try {
      setError(null);
      setDetailedError(null);
      setInitProgress(0);
      updateProgress('Checking authentication...', 0);
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        console.error('Authentication error:', sessionError);
        toast.error('Please login to access this feature');
        navigate('/login');
        return;
      }

      updateProgress('Creating POC instance...', 20);
      const newPoc = new DoclingPOC();
      
      updateProgress('Initializing OpenAI service...', 40);
      const initialized = await newPoc.initialize();
      
      if (!initialized) {
        throw new Error('Failed to initialize POC services.');
      }

      updateProgress('Verifying configuration...', 80);
      
      setPoc(newPoc);
      setIsInitialized(true);
      setInitProgress(100);
      updateProgress('Initialization complete', 100);
      
      toast.success('POC initialized successfully');
    } catch (error: any) {
      console.error('Error initializing POC:', error);
      setError(error.message || 'Failed to initialize document processing');
      setDetailedError(error.stack || 'No detailed error information available');
      setIsInitialized(false);
      setInitProgress(prevProgress => Math.max(prevProgress - 20, 0));
    }
  };

  useEffect(() => {
    initializePOC();
  }, []);

  const handleRetry = async () => {
    setIsRetrying(true);
    await initializePOC();
    setIsRetrying(false);
  };

  const handleReconfigureKey = () => {
    window.open('https://platform.openai.com/api-keys', '_blank');
    toast.info('After getting a new API key, please update it in the settings');
  };

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
        <div className="space-y-4">
          <InitializationProgress 
            stage={initStage} 
            progress={initProgress}
            stages={INITIALIZATION_STAGES}
          />
          
          {error && (
            <InitializationError
              error={error}
              detailedError={detailedError}
              onRetry={handleRetry}
              onReconfigureKey={handleReconfigureKey}
              isRetrying={isRetrying}
            />
          )}
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

        {results.length > 0 && <ResultsTable results={results} />}
      </div>
    </Card>
  );
}