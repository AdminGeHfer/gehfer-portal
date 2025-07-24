-- CRITICAL SECURITY FIXES - Phase 1 (Fixed)

-- 1. Enable RLS on Documents Table and Add Proper Policies
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view only their own documents
CREATE POLICY "Users can view their own documents" 
ON public.documents 
FOR SELECT 
USING (auth.uid() = created_by);

-- Create policy for users to insert their own documents
CREATE POLICY "Users can create their own documents" 
ON public.documents 
FOR INSERT 
WITH CHECK (auth.uid() = created_by);

-- Create policy for users to update their own documents
CREATE POLICY "Users can update their own documents" 
ON public.documents 
FOR UPDATE 
USING (auth.uid() = created_by);

-- Create policy for users to delete their own documents
CREATE POLICY "Users can delete their own documents" 
ON public.documents 
FOR DELETE 
USING (auth.uid() = created_by);

-- 2. Fix Privilege Escalation in Profiles Table
-- Drop the overly permissive update policy and create secure ones
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create secure policy for profile updates (preventing role escalation)
CREATE POLICY "Users can update their own profile data" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id AND 
  -- Prevent users from changing their own role unless they're admin
  (role = (SELECT role FROM public.profiles WHERE id = auth.uid()))
);

-- Create admin-only policy for role management
CREATE POLICY "Only admins can manage user roles" 
ON public.profiles 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ) AND role != (SELECT role FROM public.profiles WHERE id = profiles.id)
);

-- 3. Fix function search paths for security
CREATE OR REPLACE FUNCTION public.get_user_modules()
RETURNS text[]
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT modules
  FROM profiles
  WHERE id = auth.uid();
$$;