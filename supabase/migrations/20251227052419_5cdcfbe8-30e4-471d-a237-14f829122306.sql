-- Drop existing restrictive policies on maintenance_requests
DROP POLICY IF EXISTS "Users can view their own requests" ON public.maintenance_requests;
DROP POLICY IF EXISTS "Users can create their own requests" ON public.maintenance_requests;
DROP POLICY IF EXISTS "Users can update their own requests" ON public.maintenance_requests;
DROP POLICY IF EXISTS "Users can delete their own requests" ON public.maintenance_requests;

-- Create function to check if user is a technician (linked to technicians table)
CREATE OR REPLACE FUNCTION public.is_technician(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.technicians WHERE user_id = _user_id
  )
$$;

-- Create function to check if user is assigned to a request
CREATE OR REPLACE FUNCTION public.is_assigned_to_request(_user_id uuid, _request_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.maintenance_requests mr
    JOIN public.technicians t ON mr.assigned_to_id = t.id
    WHERE mr.id = _request_id AND t.user_id = _user_id
  )
$$;

-- SELECT policies
-- Admins can view all requests
CREATE POLICY "Admins can view all requests" ON public.maintenance_requests
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Moderators (Technicians) can view assigned or unassigned requests
CREATE POLICY "Technicians can view assigned or unassigned requests" ON public.maintenance_requests
FOR SELECT USING (
  public.has_role(auth.uid(), 'moderator') AND (
    assigned_to_id IS NULL OR 
    EXISTS (SELECT 1 FROM public.technicians t WHERE t.id = assigned_to_id AND t.user_id = auth.uid())
  )
);

-- Regular users can view their own requests
CREATE POLICY "Users can view own requests" ON public.maintenance_requests
FOR SELECT USING (auth.uid() = user_id);

-- INSERT policies
-- Admins can create any request
CREATE POLICY "Admins can create requests" ON public.maintenance_requests
FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Regular users can create their own requests
CREATE POLICY "Users can create own requests" ON public.maintenance_requests
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- UPDATE policies
-- Admins can update any request
CREATE POLICY "Admins can update any request" ON public.maintenance_requests
FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Technicians can update requests assigned to them (accept, change status, etc.)
CREATE POLICY "Technicians can update assigned requests" ON public.maintenance_requests
FOR UPDATE USING (
  public.has_role(auth.uid(), 'moderator') AND (
    assigned_to_id IS NULL OR 
    EXISTS (SELECT 1 FROM public.technicians t WHERE t.id = assigned_to_id AND t.user_id = auth.uid())
  )
);

-- Users can update their own requests
CREATE POLICY "Users can update own requests" ON public.maintenance_requests
FOR UPDATE USING (auth.uid() = user_id);

-- DELETE policies
-- Only admins can delete requests
CREATE POLICY "Admins can delete any request" ON public.maintenance_requests
FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Users can delete their own requests
CREATE POLICY "Users can delete own requests" ON public.maintenance_requests
FOR DELETE USING (auth.uid() = user_id);

-- Also update equipment policies for role-based access
DROP POLICY IF EXISTS "Users can view their own equipment" ON public.equipment;
DROP POLICY IF EXISTS "Users can create their own equipment" ON public.equipment;
DROP POLICY IF EXISTS "Users can update their own equipment" ON public.equipment;
DROP POLICY IF EXISTS "Users can delete their own equipment" ON public.equipment;

-- Equipment SELECT: Admins see all, Technicians see all (read-only later enforced in UI), Users see own
CREATE POLICY "Admins can view all equipment" ON public.equipment
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Technicians can view all equipment" ON public.equipment
FOR SELECT USING (public.has_role(auth.uid(), 'moderator'));

CREATE POLICY "Users can view own equipment" ON public.equipment
FOR SELECT USING (auth.uid() = user_id);

-- Equipment INSERT: Only admins
CREATE POLICY "Admins can create equipment" ON public.equipment
FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create own equipment" ON public.equipment
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Equipment UPDATE: Only admins
CREATE POLICY "Admins can update equipment" ON public.equipment
FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Equipment DELETE: Only admins
CREATE POLICY "Admins can delete equipment" ON public.equipment
FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Add UPDATE policy for user_roles (admin only)
CREATE POLICY "Admins can update user roles" ON public.user_roles
FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));