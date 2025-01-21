import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function RNCProductsPolicyTest() {
  const [results, setResults] = useState<string[]>([]);

  const runTests = async () => {
    setResults([]);
    
    // Test 1: Try to read products
    try {
      const { data: readData, error: readError } = await supabase
        .from('rnc_products')
        .select('*')
        .limit(1);
      
      if (readError) {
        setResults(prev => [...prev, `❌ Read test failed: ${readError.message}`]);
      } else {
        setResults(prev => [...prev, '✅ Read test passed: Can read products']);
      }
    } catch (error) {
      setResults(prev => [...prev, `❌ Read test error: ${error}`]);
    }

    // Test 2: Try to insert a product
    try {
      const { error: insertError } = await supabase
        .from('rnc_products')
        .insert({
          rnc_id: '00000000-0000-0000-0000-000000000000', // Invalid UUID for test
          product: 'Test Product',
          weight: 1
        });
      
      if (insertError) {
        if (insertError.message.includes('policy')) {
          setResults(prev => [...prev, '✅ Insert test passed: Non-admin cannot insert']);
        } else {
          setResults(prev => [...prev, `❓ Insert test inconclusive: ${insertError.message}`]);
        }
      } else {
        setResults(prev => [...prev, '❌ Insert test failed: Non-admin could insert']);
      }
    } catch (error) {
      setResults(prev => [...prev, `❌ Insert test error: ${error}`]);
    }

    // Test 3: Try to update a product
    try {
      const { error: updateError } = await supabase
        .from('rnc_products')
        .update({ weight: 2 })
        .eq('id', '00000000-0000-0000-0000-000000000000'); // Invalid UUID for test
      
      if (updateError) {
        if (updateError.message.includes('policy')) {
          setResults(prev => [...prev, '✅ Update test passed: Non-admin cannot update']);
        } else {
          setResults(prev => [...prev, `❓ Update test inconclusive: ${updateError.message}`]);
        }
      } else {
        setResults(prev => [...prev, '❌ Update test failed: Non-admin could update']);
      }
    } catch (error) {
      setResults(prev => [...prev, `❌ Update test error: ${error}`]);
    }

    // Test 4: Try to delete a product
    try {
      const { error: deleteError } = await supabase
        .from('rnc_products')
        .delete()
        .eq('id', '00000000-0000-0000-0000-000000000000'); // Invalid UUID for test
      
      if (deleteError) {
        if (deleteError.message.includes('policy')) {
          setResults(prev => [...prev, '✅ Delete test passed: Non-admin cannot delete']);
        } else {
          setResults(prev => [...prev, `❓ Delete test inconclusive: ${deleteError.message}`]);
        }
      } else {
        setResults(prev => [...prev, '❌ Delete test failed: Non-admin could delete']);
      }
    } catch (error) {
      setResults(prev => [...prev, `❌ Delete test error: ${error}`]);
    }

    toast.success("Tests completed!");
  };

  return (
    <div className="p-4 space-y-4">
      <Button onClick={runTests}>Run Policy Tests</Button>
      <div className="space-y-2">
        {results.map((result, index) => (
          <div key={index} className="p-2 bg-background border rounded">
            {result}
          </div>
        ))}
      </div>
    </div>
  );
}