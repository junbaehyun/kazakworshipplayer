-- ============================================================================
-- KAZAKH WORSHIP PLAYER (kwp_) — SHARED SUPABASE SETUP SCRIPT
-- Safe to run on an EXISTING Supabase project (`korsi-db`).
-- All tables and functions are prefixed with `kwp_` so they will never
-- conflict with your existing tables or storage buckets.
-- ============================================================================

-- 1. Create the Songs table (`public.kwp_songs`)
CREATE TABLE IF NOT EXISTS public.kwp_songs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    artist TEXT NOT NULL DEFAULT 'Белгісіз автор (Unknown)',
    is_unknown_author BOOLEAN NOT NULL DEFAULT true,
    permission_note TEXT DEFAULT 'Permitted for community worship sharing',
    audio_url TEXT NOT NULL,
    storage_path TEXT,
    duration_seconds INTEGER NOT NULL DEFAULT 0,
    lyrics TEXT,
    play_count BIGINT NOT NULL DEFAULT 0,
    uploaded_by TEXT DEFAULT 'community',
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'pending', 'removed')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_kwp_songs_play_count ON public.kwp_songs (play_count DESC);
CREATE INDEX IF NOT EXISTS idx_kwp_songs_created_at ON public.kwp_songs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_kwp_songs_status ON public.kwp_songs (status);

-- 2. Create the Messages, Authorship Claim & Takedown Reports table (`public.kwp_song_reports`)
CREATE TABLE IF NOT EXISTS public.kwp_song_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    song_id UUID REFERENCES public.kwp_songs(id) ON DELETE CASCADE,
    song_title TEXT NOT NULL,
    report_type TEXT NOT NULL CHECK (report_type IN ('claim_authorship', 'request_removal', 'correction', 'message')),
    reporter_name TEXT,
    reporter_contact TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Atomic RPC Function to increment play count for the Most Played Chart
CREATE OR REPLACE FUNCTION public.kwp_increment_play(target_song_id UUID)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    updated_count BIGINT;
BEGIN
    UPDATE public.kwp_songs
    SET play_count = play_count + 1
    WHERE id = target_song_id
    RETURNING play_count INTO updated_count;

    RETURN COALESCE(updated_count, 0);
END;
$$;

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.kwp_songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kwp_song_reports ENABLE ROW LEVEL SECURITY;

-- Public read published songs; Admin can read all songs
DROP POLICY IF EXISTS "kwp_songs_public_read" ON public.kwp_songs;
CREATE POLICY "kwp_songs_public_read"
    ON public.kwp_songs FOR SELECT
    TO anon, authenticated
    USING (
        (is_active = true AND status = 'published')
        OR ((select auth.jwt() ->> 'email') IN ('junbaehyun.kz@gmail.com', 'wnsqo35@gmail.com'))
    );

-- Community & Admin can insert songs
DROP POLICY IF EXISTS "kwp_songs_public_insert" ON public.kwp_songs;
CREATE POLICY "kwp_songs_public_insert"
    ON public.kwp_songs FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Only Admin can update or delete songs
DROP POLICY IF EXISTS "kwp_songs_admin_update" ON public.kwp_songs;
CREATE POLICY "kwp_songs_admin_update"
    ON public.kwp_songs FOR UPDATE
    TO authenticated
    USING ((select auth.jwt() ->> 'email') IN ('junbaehyun.kz@gmail.com', 'wnsqo35@gmail.com'))
    WITH CHECK ((select auth.jwt() ->> 'email') IN ('junbaehyun.kz@gmail.com', 'wnsqo35@gmail.com'));

DROP POLICY IF EXISTS "kwp_songs_admin_delete" ON public.kwp_songs;
CREATE POLICY "kwp_songs_admin_delete"
    ON public.kwp_songs FOR DELETE
    TO authenticated
    USING ((select auth.jwt() ->> 'email') IN ('junbaehyun.kz@gmail.com', 'wnsqo35@gmail.com'));

-- Reports & Messages: Public can insert; Only Admin can read/update/delete
DROP POLICY IF EXISTS "kwp_reports_public_insert" ON public.kwp_song_reports;
CREATE POLICY "kwp_reports_public_insert"
    ON public.kwp_song_reports FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "kwp_reports_admin_read" ON public.kwp_song_reports;
CREATE POLICY "kwp_reports_admin_read"
    ON public.kwp_song_reports FOR SELECT
    TO authenticated
    USING ((select auth.jwt() ->> 'email') IN ('junbaehyun.kz@gmail.com', 'wnsqo35@gmail.com'));

DROP POLICY IF EXISTS "kwp_reports_admin_update" ON public.kwp_song_reports;
CREATE POLICY "kwp_reports_admin_update"
    ON public.kwp_song_reports FOR UPDATE
    TO authenticated
    USING ((select auth.jwt() ->> 'email') IN ('junbaehyun.kz@gmail.com', 'wnsqo35@gmail.com'))
    WITH CHECK ((select auth.jwt() ->> 'email') IN ('junbaehyun.kz@gmail.com', 'wnsqo35@gmail.com'));

DROP POLICY IF EXISTS "kwp_reports_admin_delete" ON public.kwp_song_reports;
CREATE POLICY "kwp_reports_admin_delete"
    ON public.kwp_song_reports FOR DELETE
    TO authenticated
    USING ((select auth.jwt() ->> 'email') IN ('junbaehyun.kz@gmail.com', 'wnsqo35@gmail.com'));

-- 5. Storage Bucket Setup (`kazakh-worship`)
INSERT INTO storage.buckets (id, name, public)
VALUES ('kazakh-worship', 'kazakh-worship', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "kwp_storage_public_read" ON storage.objects;
CREATE POLICY "kwp_storage_public_read"
    ON storage.objects FOR SELECT
    TO anon, authenticated
    USING (bucket_id = 'kazakh-worship');

DROP POLICY IF EXISTS "kwp_storage_public_insert" ON storage.objects;
CREATE POLICY "kwp_storage_public_insert"
    ON storage.objects FOR INSERT
    TO anon, authenticated
    WITH CHECK (bucket_id = 'kazakh-worship');

DROP POLICY IF EXISTS "kwp_storage_admin_delete" ON storage.objects;
CREATE POLICY "kwp_storage_admin_delete"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'kazakh-worship'
        AND ((select auth.jwt() ->> 'email') IN ('junbaehyun.kz@gmail.com', 'wnsqo35@gmail.com'))
    );

-- 6. Seed initial test song (stored in Google Drive via GAS)
INSERT INTO public.kwp_songs (
    title,
    artist,
    is_unknown_author,
    permission_note,
    audio_url,
    storage_path,
    duration_seconds,
    lyrics,
    play_count,
    uploaded_by,
    status,
    is_active
)
SELECT
    'Кел, кел бізге Имануил',
    'Дамира Мусаева',
    false,
    'Test track (#5887)',
    'gdrive://1HOiGn1spawD9U_qIrNOC66u4i5qj4LFd',
    '1HOiGn1spawD9U_qIrNOC66u4i5qj4LFd',
    159,
    E'Кел, кел бізге, Имануил,\nҚұдай бізбен бірге Имануил.\nКүтеміз біз сені, Имануил,\nТәңір бізбен бірге - Имануил.\n\n// Шаттан, шаттан, шаттан Қазақстан,\nИмануел саған келмек //',
    1,
    'developer',
    'published',
    true
WHERE NOT EXISTS (
    SELECT 1 FROM public.kwp_songs WHERE storage_path = '1HOiGn1spawD9U_qIrNOC66u4i5qj4LFd'
);
