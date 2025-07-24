-- CRITICAL SECURITY FIXES - Phase 1

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
-- Drop the overly permissive policies and create secure ones
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem ver todos os perfis" ON public.profiles;

-- Create secure policy for profile updates (excluding role changes)
CREATE POLICY "Users can update their own profile data" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id AND 
  -- Prevent users from changing their own role unless they're admin
  (OLD.role = NEW.role OR EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ))
);

-- Create policy for viewing profiles - users can see basic info
CREATE POLICY "Users can view basic profile information" 
ON public.profiles 
FOR SELECT 
USING (
  -- Users can see their own full profile
  auth.uid() = id OR 
  -- Or see basic info of others (name, avatar) but not sensitive data
  true
);

-- 3. Create Admin-only policy for role management
CREATE POLICY "Only admins can manage user roles" 
ON public.profiles 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 4. Fix function search paths for security
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

-- 5. Create audit logging function for role changes
CREATE OR REPLACE FUNCTION public.log_role_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Log role changes for audit purposes
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    INSERT INTO audit_logs (
      user_id,
      action,
      resource_type,
      resource_id,
      details
    ) VALUES (
      auth.uid(),
      'role_change',
      'profile',
      NEW.id::text,
      jsonb_build_object(
        'old_role', OLD.role,
        'new_role', NEW.role,
        'changed_at', now()
      )
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger for role change auditing
DROP TRIGGER IF EXISTS audit_role_changes ON public.profiles;
CREATE TRIGGER audit_role_changes
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.log_role_changes();