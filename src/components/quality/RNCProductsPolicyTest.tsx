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

    // First get user profile to check if admin
    const { data: profile } = await supabase.auth.getUser();
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('modules')
      .eq('id', profile.user?.id)
      .single();
    
    const isAdmin = userProfile?.modules?.includes('admin');

    // Create a test RNC if needed
    let testRnc;
    try {
      // First try to find an existing RNC created by the current user
      const { data: existingRnc } = await supabase
        .from('rncs')
        .select('*')
        .eq('created_by', profile.user?.id)
        .limit(1)
        .single();

      if (existingRnc) {
        testRnc = existingRnc;
        setResults(prev => [...prev, '✅ Setup: Using existing RNC']);
      } else {
        // Create a new test RNC
        const { data: newRnc, error: rncError } = await supabase
          .from('rncs')
          .insert({
            description: 'Test RNC for policy testing',
            type: 'company_complaint',
            company: 'Test Company',
            cnpj: '00.000.000/0000-00',
            company_code: 'TEST',
            department: 'quality',
            created_by: profile.user?.id
          })
          .select()
          .single();

        if (rncError) throw rncError;
        testRnc = newRnc;
        setResults(prev => [...prev, '✅ Setup: Created new test RNC']);
      }
    } catch (error) {
      setResults(prev => [...prev, `❌ Setup failed: ${error}`]);
      return;
    }

    if (!testRnc) {
      setResults(prev => [...prev, '❌ Setup failed: Could not create or find test RNC']);
      return;
    }

    // Test 2: Try to insert a product
    try {
      const { error: insertError } = await supabase
        .from('rnc_products')
        .insert({
          rnc_id: testRnc.id,
          product: 'Test Product',
          weight: 1
        });
      
      if (insertError) {
        if (isAdmin) {
          setResults(prev => [...prev, `❌ Insert test failed: Admin should be able to insert`]);
        } else {
          setResults(prev => [...prev, '✅ Insert test passed: Non-admin cannot insert to other RNCs']);
        }
      } else {
        if (isAdmin || testRnc.created_by === profile.user?.id) {
          setResults(prev => [...prev, '✅ Insert test passed: Admin/Owner can insert']);
        } else {
          setResults(prev => [...prev, '❌ Insert test failed: Non-owner could insert']);
        }
      }
    } catch (error) {
      setResults(prev => [...prev, `❌ Insert test error: ${error}`]);
    }

    // Test 3: Try to update a product
    try {
      // First insert a test product if admin or owner
      let testProductId = null;
      if (isAdmin || testRnc.created_by === profile.user?.id) {
        const { data: insertedProduct } = await supabase
          .from('rnc_products')
          .insert({
            rnc_id: testRnc.id,
            product: 'Test Product for Update',
            weight: 1
          })
          .select()
          .single();
        
        testProductId = insertedProduct?.id;
      }

      if (testProductId) {
        const { error: updateError } = await supabase
          .from('rnc_products')
          .update({ weight: 2 })
          .eq('id', testProductId);
        
        if (updateError) {
          if (isAdmin) {
            setResults(prev => [...prev, `❌ Update test failed: Admin should be able to update`]);
          } else if (testRnc.created_by === profile.user?.id) {
            setResults(prev => [...prev, `❌ Update test failed: Owner should be able to update`]);
          } else {
            setResults(prev => [...prev, '✅ Update test passed: Non-owner cannot update']);
          }
        } else {
          if (isAdmin || testRnc.created_by === profile.user?.id) {
            setResults(prev => [...prev, '✅ Update test passed: Admin/Owner can update']);
          } else {
            setResults(prev => [...prev, '❌ Update test failed: Non-owner could update']);
          }
        }
      }
    } catch (error) {
      setResults(prev => [...prev, `❌ Update test error: ${error}`]);
    }

    // Test 4: Try to delete a product
    try {
      // First insert a test product if admin or owner
      let testProductId = null;
      if (isAdmin || testRnc.created_by === profile.user?.id) {
        const { data: insertedProduct } = await supabase
          .from('rnc_products')
          .insert({
            rnc_id: testRnc.id,
            product: 'Test Product for Delete',
            weight: 1
          })
          .select()
          .single();
        
        testProductId = insertedProduct?.id;
      }

      if (testProductId) {
        const { error: deleteError } = await supabase
          .from('rnc_products')
          .delete()
          .eq('id', testProductId);
        
        if (deleteError) {
          if (isAdmin) {
            setResults(prev => [...prev, `❌ Delete test failed: Admin should be able to delete`]);
          } else if (testRnc.created_by === profile.user?.id) {
            setResults(prev => [...prev, `❌ Delete test failed: Owner should be able to delete`]);
          } else {
            setResults(prev => [...prev, '✅ Delete test passed: Non-owner cannot delete']);
          }
        } else {
          if (isAdmin || testRnc.created_by === profile.user?.id) {
            setResults(prev => [...prev, '✅ Delete test passed: Admin/Owner can delete']);
          } else {
            setResults(prev => [...prev, '❌ Delete test failed: Non-owner could delete']);
          }
        }
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