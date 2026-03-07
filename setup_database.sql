-- 1. Create PROFILES table (extending Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name text,
  email text UNIQUE,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 2. Create RESUMES table (for AI uploads and metadata)
CREATE TABLE IF NOT EXISTS public.resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  filename text NOT NULL,
  storage_path text NOT NULL,
  title text,
  parsed_text text,
  parsed_json jsonb,
  template text,
  style jsonb,
  visibility text DEFAULT 'private',
  status text DEFAULT 'started',
  download_count integer DEFAULT 0,
  started_at timestamp with time zone DEFAULT now(),
  completed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 3. Create BUILDER_RESUMES table (source of truth for the editor)
CREATE TABLE IF NOT EXISTS public.builder_resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  template_id text,
  title text DEFAULT 'Untitled Resume',
  data jsonb DEFAULT '{}'::jsonb,
  design_settings jsonb DEFAULT '{}'::jsonb,
  onboarding_metadata jsonb DEFAULT '{}'::jsonb,
  last_step_index integer DEFAULT 1,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 4. Create RESUME_VERSIONS table (autosave history)
CREATE TABLE IF NOT EXISTS public.resume_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id uuid REFERENCES public.builder_resumes(id) ON DELETE CASCADE,
  snapshot_json jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- 5. Create AI_JOBS table (for async parsing queue)
CREATE TABLE IF NOT EXISTS public.ai_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  type text NOT NULL,
  input jsonb,
  status text DEFAULT 'queued',
  result jsonb,
  last_error jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.builder_resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_jobs ENABLE ROW LEVEL SECURITY;

-- CREATE POLICIES (Users can only see their own data)
CREATE POLICY "Users can only view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can only view their own resumes" ON public.resumes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can only view their own drafts" ON public.builder_resumes FOR ALL USING (auth.uid() = profile_id);
CREATE POLICY "Users can only view their own versions" ON public.resume_versions FOR ALL USING (
    EXISTS (SELECT 1 FROM public.builder_resumes WHERE id = resume_id AND profile_id = auth.uid())
);
CREATE POLICY "Users can only view their own ai jobs" ON public.ai_jobs FOR ALL USING (auth.uid() = user_id);
