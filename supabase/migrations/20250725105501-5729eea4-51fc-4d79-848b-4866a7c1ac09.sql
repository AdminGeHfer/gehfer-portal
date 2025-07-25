-- CRITICAL SECURITY FIXES - PHASE 1

-- 1. SECURE THE SECRETS TABLE
-- Current policy allows all authenticated users to read secrets (including OpenAI API keys)
-- This is a CRITICAL vulnerability - replacing with admin-only access

DROP POLICY IF EXISTS "Allow read access to authenticated users" ON public.secrets;

-- Create admin-only access policy for secrets
CREATE POLICY "Admin only access to secrets"
ON public.secrets
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- 2. CREATE ADMIN ROLE VERIFICATION FUNCTION FOR EDGE FUNCTIONS
-- This function will be used by the admin-reset-password edge function
CREATE OR REPLACE FUNCTION public.verify_admin_role(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND role = 'admin'
  );
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.verify_admin_role(uuid) TO authenticated;

-- 3. HARDEN PROFILE ROLE MANAGEMENT
-- Prevent privilege escalation by restricting role changes to admins only
DROP POLICY IF EXISTS "Users can update their own profile data" ON public.profiles;

-- Create separate policies for profile updates vs role changes
CREATE POLICY "Users can update their own profile data (excluding role)"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id AND
  -- Prevent role changes in regular profile updates
  role = (SELECT role FROM public.profiles WHERE id = auth.uid())
);

-- Admin-only role management policy
CREATE POLICY "Only admins can change user roles"
ON public.profiles
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- 4. ADD AUDIT LOGGING FOR SECURITY EVENTS
-- Create function to log security-sensitive operations
CREATE OR REPLACE FUNCTION public.log_security_event()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Log role changes
  IF TG_OP = 'UPDATE' AND OLD.role IS DISTINCT FROM NEW.role THEN
    INSERT INTO public.audit_logs (
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
        'target_user', NEW.id
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for role change logging
DROP TRIGGER IF EXISTS profile_security_audit ON public.profiles;
CREATE TRIGGER profile_security_audit
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.log_security_event();