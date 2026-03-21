-- ============================================================
-- Migration: Rate Limiting Infrastructure
-- Atomic check_rate_limit() function with cleanup.
-- ============================================================

-- Rate limits table
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  action TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on rate_limits
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Service role can do everything; users cannot directly access this table
-- (Edge Functions use service role key)

-- Indexes for fast lookups and cleanup
CREATE INDEX IF NOT EXISTS idx_rate_limits_user_action ON public.rate_limits (user_id, action, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rate_limits_created_at ON public.rate_limits (created_at);

-- Atomic rate limit check function
-- Returns TRUE if the request is allowed, FALSE if rate limited.
-- Automatically cleans up old entries and inserts a new one if allowed.
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_user_id UUID,
  p_action TEXT,
  p_max_requests INTEGER,
  p_window_seconds INTEGER DEFAULT 60
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_window_start TIMESTAMP WITH TIME ZONE;
  v_current_count INTEGER;
BEGIN
  v_window_start := NOW() - (p_window_seconds || ' seconds')::INTERVAL;

  -- Clean up old entries for this user+action (older than 2x window to be safe)
  DELETE FROM public.rate_limits
  WHERE user_id = p_user_id
    AND action = p_action
    AND created_at < v_window_start;

  -- Count current requests in window
  SELECT COUNT(*) INTO v_current_count
  FROM public.rate_limits
  WHERE user_id = p_user_id
    AND action = p_action
    AND created_at >= v_window_start;

  -- If at or over limit, deny
  IF v_current_count >= p_max_requests THEN
    RETURN FALSE;
  END IF;

  -- Record this request
  INSERT INTO public.rate_limits (user_id, action, created_at)
  VALUES (p_user_id, p_action, NOW());

  RETURN TRUE;
END;
$$;

-- Periodic cleanup function (can be called by cron or manually)
CREATE OR REPLACE FUNCTION public.cleanup_rate_limits(p_older_than_seconds INTEGER DEFAULT 300)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_deleted INTEGER;
BEGIN
  DELETE FROM public.rate_limits
  WHERE created_at < NOW() - (p_older_than_seconds || ' seconds')::INTERVAL;
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN v_deleted;
END;
$$;
