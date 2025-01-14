import { supabase } from "@/integrations/supabase/client";

interface TestVariant {
  id: string;
  name: string;
  configuration;
}

export const getTestVariant = async (userId: string): Promise<TestVariant | null> => {
  try {
    // Deterministic variant assignment based on user ID
    const variantIndex = Buffer.from(userId).reduce((a, b) => a + b, 0) % 2;
    
    const variants: TestVariant[] = [
      {
        id: 'A',
        name: 'Control',
        configuration: {
          useEnhancedMemory: false,
          useContextRetention: false
        }
      },
      {
        id: 'B',
        name: 'Enhanced',
        configuration: {
          useEnhancedMemory: true,
          useContextRetention: true
        }
      }
    ];

    const selectedVariant = variants[variantIndex];

    // Log variant assignment
    await supabase
      .from('ai_agent_logs')
      .insert({
        event_type: 'ab_test_assignment',
        created_by: userId,
        configuration: {
          variant: selectedVariant.id,
          timestamp: new Date().toISOString()
        }
      });

    return selectedVariant;
  } catch (error) {
    console.error('Error in A/B test assignment:', error);
    return null;
  }
};

export const trackTestMetrics = async (
  userId: string,
  variantId: string,
  metrics
) => {
  try {
    await supabase
      .from('ai_agent_logs')
      .insert({
        event_type: 'ab_test_metrics',
        created_by: userId,
        configuration: {
          variant: variantId,
          metrics,
          timestamp: new Date().toISOString()
        }
      });
  } catch (error) {
    console.error('Error tracking A/B test metrics:', error);
  }
};