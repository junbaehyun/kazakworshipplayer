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

-- 7. Seed second test song (direct external MP3 URL — 0 server storage)
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
    'Жас кезімнен мені сақтап жүрдің Сен',
    'Белгісіз автор (Шаттан 2016)',
    true,
    'External MP3 link test (#103021)',
    'https://repo.worshipleaderapp.com/mp3/07%20Zhas%20kezimnen%20meni%20sak_tap%20zhurdin_%20Sen%20Track%207%201.mp3',
    NULL,
    377,
    E'[V1]\nЖас кезімнен мені сақтап тұрдың Сен,\nӨмірімнің қиындығын көріп е(ді)ң.\nАзат еттің сол қиындық кезеңнен,\nАлғысымды жеткіземін әніммен.\n\n[C1]\n// Жан Ә--кем! Мейірімді Әкем!\nСа-ғын-дым мен Сені, мейірім-ді Әкем! //\n\n[V2]\nӘрқашанда ойымда Сен тұрасың,\nЖаңа өмір сыйлап мені қуанттың.\nБұл өмірде Сенің асыл Сөзіңе,\nОрын берем жүрегімнің төрінен.',
    1,
    'developer',
    'published',
    true
WHERE NOT EXISTS (
    SELECT 1 FROM public.kwp_songs WHERE audio_url = 'https://repo.worshipleaderapp.com/mp3/07%20Zhas%20kezimnen%20meni%20sak_tap%20zhurdin_%20Sen%20Track%207%201.mp3'
);

-- 8. Seed top 10 most played Kazakh worship songs (direct external MP3 URLs)
INSERT INTO public.kwp_songs (title, artist, is_unknown_author, permission_note, audio_url, storage_path, duration_seconds, lyrics, play_count, uploaded_by, status, is_active)
SELECT
    'Жаратқан жерді де, аспанды да (Жетеле мені, жетеле)',
    'Шынтеміров Әбілхайыр',
    false,
    'Top #1 Kazakh worship (#5855 · worshipleaderapp.com)',
    'https://repo.worshipleaderapp.com/mp3/Shetele%20meni.mp3',
    NULL,
    220,
    E'Жаратқан жерді де, аспанды да.\nШын сүйіп бас ием Құдайыма.\nАдамзат күнәдан арылсын деп\nЖіберді Өз Ұлы Исаны да.\n\nЖетеле мені, жетеле,\nҒажайып жұмақ төріне.\nРухыңды берсең кеудеме,\nМәңгілік құлмын Өзіңе.\nӨзіңе ғана бағынам,\nӨзіңе ғана табынам.\nӨзіңнен артық панам жоқ,\nҚұдайым Саған сиынам.\n\nАдасып көп жылдар шаршадым мен,\nСонда да тыныштық таппадым мен.\nСол сәтте Құдайды ойға алып едім\nБақытқа кенеліп шаттандым мен.\n\nОқыдым Киелі кітабыңды.\nЖүрегім азаптан құтқарылды.\nҰмыттым қайғы мен азабымды,\nӨйткені таныдым Құдайымды.',
    260, 'developer', 'published', true
WHERE NOT EXISTS (SELECT 1 FROM public.kwp_songs WHERE audio_url = 'https://repo.worshipleaderapp.com/mp3/Shetele%20meni.mp3');

INSERT INTO public.kwp_songs (title, artist, is_unknown_author, permission_note, audio_url, storage_path, duration_seconds, lyrics, play_count, uploaded_by, status, is_active)
SELECT
    'Әр күнде Иса маған қажетсің',
    'Eddie Espinosa (Қазақша аударма)',
    false,
    'Top #3 Kazakh worship (#5873 · worshipleaderapp.com)',
    'https://repo.worshipleaderapp.com/mp3/Ar%20kunde%20Isa%20magan%20kazhetsin.mp3',
    NULL,
    168,
    E'Әр күнде Иса маған қажетсің,\nКүн сайын Иса маған қажетсің.\nКүнделікті нандай, күнделікті нандай Сен керексің.\nСенің Сөзің маған әр күн қажет.\n\nМен шаршадым, мен мұңайдым,\nМен адастым Сенсіз Иса.',
    240, 'developer', 'published', true
WHERE NOT EXISTS (SELECT 1 FROM public.kwp_songs WHERE audio_url = 'https://repo.worshipleaderapp.com/mp3/Ar%20kunde%20Isa%20magan%20kazhetsin.mp3');

INSERT INTO public.kwp_songs (title, artist, is_unknown_author, permission_note, audio_url, storage_path, duration_seconds, lyrics, play_count, uploaded_by, status, is_active)
SELECT
    'Жүрегімді өзгертші Тәңір',
    'Eddie Espinosa',
    false,
    'Top #4 Kazakh worship (#5856 · worshipleaderapp.com)',
    'https://repo.worshipleaderapp.com/mp3/Abukhair%2006.mp3',
    NULL,
    203,
    E'Жүрегімді өзгертші Тәңір,\nАдал ете гөр.\nЖүрегімді өзгертші Тәңір,\nСендей ете гөр.\n\nСен – Шеберсің, балшықпын мен,\nӨзің құйшы, сұраймын мен.',
    225, 'developer', 'published', true
WHERE NOT EXISTS (SELECT 1 FROM public.kwp_songs WHERE audio_url = 'https://repo.worshipleaderapp.com/mp3/Abukhair%2006.mp3');

INSERT INTO public.kwp_songs (title, artist, is_unknown_author, permission_note, audio_url, storage_path, duration_seconds, lyrics, play_count, uploaded_by, status, is_active)
SELECT
    'Осы әлемде мен жүрдім (Киелі Құдай)',
    'Белгісіз автор',
    true,
    'Top #5 Kazakh worship (#5997 · worshipleaderapp.com)',
    'https://repo.worshipleaderapp.com/mp3/Osy%20elemde%20men%20zhurdym%20%20osoboe%20mnenie_.mp3',
    NULL,
    237,
    E'Осы әлемде мен жүрдім, мәнін білмей өмірдің.\nӨтірікке сеніппін, жалған сөзге еріппін.\nСонда Сені мен көрдім, жарық нұр боп көріндің,\nКүнәларым кешіріп, бақыт бердің өмірге!\n\nКиелі, Киелі Құдай!\nСен менің жүрегімдесің,\nСен менің көңілімдесің,\nСен менің өмірімдесің Иса!\n\nҚуанамын мен бүгін, бақыттымын мәңгілік!\nЖүрегімде ән салып, шырқаймын мен ән салып.\nМадақтаймын мен Сені, сүйем Сені Тәңірім!\nӘрбір басқан қадамым Сенің қолыңда бүгін!',
    210, 'developer', 'published', true
WHERE NOT EXISTS (SELECT 1 FROM public.kwp_songs WHERE audio_url = 'https://repo.worshipleaderapp.com/mp3/Osy%20elemde%20men%20zhurdym%20%20osoboe%20mnenie_.mp3');

INSERT INTO public.kwp_songs (title, artist, is_unknown_author, permission_note, audio_url, storage_path, duration_seconds, lyrics, play_count, uploaded_by, status, is_active)
SELECT
    'Жолымдағы жарық жұлдыздай',
    'Белгісіз автор',
    true,
    'Top #6 Kazakh worship (#5859 · worshipleaderapp.com)',
    'https://repo.worshipleaderapp.com/mp3/Zholimdagi%20sharyk%20shuldysdai%201.mp3',
    NULL,
    292,
    E'Жолымдағы жарық жұлдыздай\nЖүрегімнің нұры Өзіңсің.\nҚараңғыда адасып қалмай\nӨзіңе мен еріп келемін.\n\nЖетелеші мені Тәңірім,\nНұрыңа Сен бөлей гөр мені.\nӨзің болдың өмір тірегім,\nМәңгілікке сүйемін Сені.\n\nКөңілімнің шаттығы Сенсің,\nЖанымның Сен жұбанышысың.\nӨмірімнің мәні бір Өзің,\nЖаратушым, Құтқарушымсың.',
    195, 'developer', 'published', true
WHERE NOT EXISTS (SELECT 1 FROM public.kwp_songs WHERE audio_url = 'https://repo.worshipleaderapp.com/mp3/Zholimdagi%20sharyk%20shuldysdai%201.mp3');

INSERT INTO public.kwp_songs (title, artist, is_unknown_author, permission_note, audio_url, storage_path, duration_seconds, lyrics, play_count, uploaded_by, status, is_active)
SELECT
    'Мені қолдайсың Құдайым',
    'Белгісіз автор',
    true,
    'Top #7 Kazakh worship (#5989 · worshipleaderapp.com)',
    'https://repo.worshipleaderapp.com/mp3/Meni%20koldaisin.mp3',
    NULL,
    263,
    E'Мені қолдайсың Құдайым әр күнде,\nСенің қалауың менің өмірімде.\nБасыма қандай сынақ түссе дағы,\nСенің рақымың менімен мәңгіге.\n\nСен менің панамсың, таусылмас күшімсің,\nЖүрегімді билеген жалғыз Үмітімсің.\nМадақтаймын Сені, бар дауыспен ән салам,\nТәңірім Иса, мен Саған бағынам!',
    185, 'developer', 'published', true
WHERE NOT EXISTS (SELECT 1 FROM public.kwp_songs WHERE audio_url = 'https://repo.worshipleaderapp.com/mp3/Meni%20koldaisin.mp3');

INSERT INTO public.kwp_songs (title, artist, is_unknown_author, permission_note, audio_url, storage_path, duration_seconds, lyrics, play_count, uploaded_by, status, is_active)
SELECT
    'Таң атқанда',
    'Ыдырыс',
    false,
    'Top #8 Kazakh worship (#6040 · worshipleaderapp.com)',
    'https://repo.worshipleaderapp.com/mp3/09%20Tan_%20atk_anda.mp3',
    NULL,
    311,
    E'Таң атқанда оянып, Сені шақырам,\nҚуанып мен ән салам. Сені жырлаймын.\n\nАңсайсың Сен менің жырымды,\nСаған арналған өмірімді.\nКүні бойы Сені мақтаймын,\nМахаббатыңды жариялаймын.\nО, Иса! (О, Иса) О, Иса! Иса! О, Иса,\nДәл қазір келші маған,\nСағындым мен.\n\nСені сүйем, мен бас ием, Тәңірім-ай!',
    175, 'developer', 'published', true
WHERE NOT EXISTS (SELECT 1 FROM public.kwp_songs WHERE audio_url = 'https://repo.worshipleaderapp.com/mp3/09%20Tan_%20atk_anda.mp3');

INSERT INTO public.kwp_songs (title, artist, is_unknown_author, permission_note, audio_url, storage_path, duration_seconds, lyrics, play_count, uploaded_by, status, is_active)
SELECT
    'Тәңірді мадақта (Он мың себеп)',
    'Jonas Myrin, Matt Redman (Ауд. Нұржан Төлеген)',
    false,
    'Top #9 Kazakh worship (#9685 · worshipleaderapp.com)',
    'https://repo.worshipleaderapp.com/mp3/10%20On%20myn_%20sebep..Track%2010.mp3',
    NULL,
    279,
    E'Тәңірді мадақта жан-дүнием!\nКиелі есімін!\nБар дауыспен мадақта жан-дүнием!\nТәңірді мадақта!\n\nТамаша арайлы таң атты,\nТәңірім ғажап күн жаратты.\nОсынау керемет рақымы үшін,\nАрнайық біз мадақты.\n\nРақымың мен махаббатың шексіз,\nТәңірім Сен ұлысың.\nОн мың себеп те аз болар маған\nМәңгі айтар жырымсың!\n\nҚуатым кеміп сарқылған күні,\nАжалым жетіп ақырғы.\nЖан-дүнием Сені жырлайды тағы,\nМәңгілікке Атыңды!\n\nТәңірді мадақта жан-дүнием!\nКиелі есімін!\nБар дауыспен мадақта жан-дүнием!\nТәңірді мадақта!\nТәңірді мадақта!\nТәңірді мадақта!',
    165, 'developer', 'published', true
WHERE NOT EXISTS (SELECT 1 FROM public.kwp_songs WHERE audio_url = 'https://repo.worshipleaderapp.com/mp3/10%20On%20myn_%20sebep..Track%2010.mp3');

INSERT INTO public.kwp_songs (title, artist, is_unknown_author, permission_note, audio_url, storage_path, duration_seconds, lyrics, play_count, uploaded_by, status, is_active)
SELECT
    'Келемін Саған Жаратушым',
    'Эва-Лена Хеллмарк',
    false,
    'Top #10 Kazakh worship (#5888 · worshipleaderapp.com)',
    'https://repo.worshipleaderapp.com/mp3/kaelaem_n%20s_n.mp3',
    NULL,
    244,
    E'Келемін Саған Жаратушым\nСенің шексіз махаббатың,\nТаусылмайды рақымың.\n\nҰлысың Сен,\nСен ғажайып ұлысың.\nСенен артық ешкім жоқ,\nСаған ешкім тең келмес.\n\nКелемін Саған, аңсап Сені.\nЖүрегімді жадыратшы,\nМәңгілікке жасашы.',
    158, 'developer', 'published', true
WHERE NOT EXISTS (SELECT 1 FROM public.kwp_songs WHERE audio_url = 'https://repo.worshipleaderapp.com/mp3/kaelaem_n%20s_n.mp3');

INSERT INTO public.kwp_songs (title, artist, is_unknown_author, permission_note, audio_url, storage_path, duration_seconds, lyrics, play_count, uploaded_by, status, is_active)
SELECT
    'Патшалық, салтанат',
    'Chris Tomlin, Jesse Reeves, Ed Cash (Ауд. Нұржан Төлеген)',
    false,
    'Top #11 Kazakh worship (#9679 · worshipleaderapp.com)',
    'https://repo.worshipleaderapp.com/mp3/04%20Patshalyk_%20saltanat%20Track%204.mp3',
    NULL,
    232,
    E'Патшалық салтанат\nҰлылық жарқырап\nБәрі ән салсын\nҒаламға жар салсын!\nӨзін нұрға бөлеп\nЖасырынды түнек\nЕстіп үнін Оның,\nЕстіп үнін Оның\n\nИеміз - ұлы!\nӘнге сал бірге, Ол - ұлы!\nБарлығы көрсін,\nБілсін Ол - ұлы!\n\nҒасырдан ғасырға\nБарлығы қолында\nБасы Ол соңы да, басы Ол соңы да\nҮшбірліктегі Ол\nӘке Рух және Ұл\n«Арыстан» да Өзі\nКелген болып «Қозы»\n\nЕсімі ең жоғары\nБар мадаққа лайықты,\nЖан дүнием жырласын,\nОл - ұлы!',
    152, 'developer', 'published', true
WHERE NOT EXISTS (SELECT 1 FROM public.kwp_songs WHERE audio_url = 'https://repo.worshipleaderapp.com/mp3/04%20Patshalyk_%20saltanat%20Track%204.mp3');

-- 9. Seed ranks #12-#21 (up to Top 20)
INSERT INTO public.kwp_songs (title, artist, is_unknown_author, permission_note, audio_url, storage_path, duration_seconds, lyrics, play_count, uploaded_by, status, is_active)
SELECT
    'Барлық аспан',
    'Noel Richards, Tricia Richards',
    false,
    'Top #12 Kazakh worship (#5828 · worshipleaderapp.com)',
    'https://repo.worshipleaderapp.com/mp3/Barlikaspan.mp3',
    NULL,
    266,
    E'Барлық аспан атыңды мадақтайды Ием.\nСенің көркің немен теңеседі екен.\n\nМәңгі отырасың (Мәңгі отырасың)\nЖарқыраған тақта. (Жарқыраған тақта.)\nТек Сенің алдыңда (Тек Сенің алдыңда)\nТізе бүгемін мен !\n\nМадақтаймын Сенің даңқыңды жан Ием,\nСен біз үшін өміріңді құрбан еттің.\n\nАялаймын Сенің Сөзіңді жан Ием.\nЖаратушым, бір Өзіңе дұға етем.',
    149, 'developer', 'published', true
WHERE NOT EXISTS (SELECT 1 FROM public.kwp_songs WHERE audio_url = 'https://repo.worshipleaderapp.com/mp3/Barlikaspan.mp3');

INSERT INTO public.kwp_songs (title, artist, is_unknown_author, permission_note, audio_url, storage_path, duration_seconds, lyrics, play_count, uploaded_by, status, is_active)
SELECT
    'Атың Мадақталсын',
    'Matt & Beth Redman (Ауд. Нұржан Төлеген)',
    false,
    'Top #13 Kazakh worship (#7681 · worshipleaderapp.com)',
    'https://repo.worshipleaderapp.com/mp3/01%20Track%201.mp3',
    NULL,
    220,
    E'Атың мадақталсын\nОрман тауым көлімде\nЖер мен аспан төрінде\nАтың мадақталсын!\n\nАтың мадақталсын\nШексіз мына ғаламда\nЖүрегім ой санамда\nАтың мадақталсын!\n\nӘрбір атқан таңым үшін мадақтаймын\nЕсіміңді бар әлемге жариялаймын!\n\nАтың мадақталсын Тәңір\nМәңгі мадақталсын\nӨзіңмен ғажап біздің өмір\nКиелі есімің даңқталсын!\n\nАтың Мадақталсын\nБиік шыңға жетсем де\nТерең құзға кетсем де\nАтың Мадақталсын\n\nАтың мадақталсын\nҚандай сыннан өтсемде\nШаттыққа кенелсем де\nАтың мадақталсын\n\n// Беретін де Сенсің Ием! алатын да Сенсің Ием!\nҚұдіретің мен еркіңе, мен басымды Ием! //',
    146, 'developer', 'published', true
WHERE NOT EXISTS (SELECT 1 FROM public.kwp_songs WHERE audio_url = 'https://repo.worshipleaderapp.com/mp3/01%20Track%201.mp3');

INSERT INTO public.kwp_songs (title, artist, is_unknown_author, permission_note, audio_url, storage_path, duration_seconds, lyrics, play_count, uploaded_by, status, is_active)
SELECT
    'Құрметтеймін Сені балаңдай',
    'Белгісіз автор',
    true,
    'Top #15 Kazakh worship (#5959 · worshipleaderapp.com)',
    'https://repo.worshipleaderapp.com/mp3/05%20K_u_rmetteimin%20Seni%20balan_dai%20Track%2005.mp3',
    NULL,
    231,
    E'Құрметтеймін Сені балаңдай,\nМадақтаймын әнменен тынбай.\nЖар болшы маған Тәңір,\nАдалсың Сен мәңгі.\n\nҚараңғыдан шығарған,\nРақымын мол сыйлаған,\nКүнәмді кешіріп, өлімнен мені құтқарған.\n\nҚұтқарушым менің, мен Сені сүйемін.\nСаған мәңгі ризамын.\nЖан-тәніммен Сені, Иса, жалғыз Сені,\nМен мадақтаймын!\n\nҚұтқарушым менің, мен Сені сүйемін.\nКешірші деп сұраймын.\nМейірімді Иемді, жақсы адал Иемді,\nМәңгі жырлаймын, мәңгі жырлаймын.\n\nӘн саламын қуанғанымнан,\nЕшқашан кетпеші жанымнан.\nПанам болшы, О, Тәңір,\nАдалсын Сен мәңгі.\n\nТіршілікті жаратқан,\nОйын іске асырған.\nӨзін құрметтеген адамға\nЖаны ашыған.',
    143, 'developer', 'published', true
WHERE NOT EXISTS (SELECT 1 FROM public.kwp_songs WHERE audio_url = 'https://repo.worshipleaderapp.com/mp3/05%20K_u_rmetteimin%20Seni%20balan_dai%20Track%2005.mp3');

INSERT INTO public.kwp_songs (title, artist, is_unknown_author, permission_note, audio_url, storage_path, duration_seconds, lyrics, play_count, uploaded_by, status, is_active)
SELECT
    'Қайғы тартып қиналғанда',
    'Шынтеміров Әбілхайыр',
    false,
    'Top #16 Kazakh worship (#5964 · worshipleaderapp.com)',
    'https://repo.worshipleaderapp.com/mp3/KaigitartipKinalganda.mp3',
    NULL,
    166,
    E'Қайғы тартып қиналғанда\nЖол таба алмай адасқанда,\nБір Өзіңе келдім Әке,\nКөрінбейтін болсаң да.\n\nҚараңғыда жатқанымда,\nКүнәға әбден батқанымда\nБар екенсің сездім Әке,\nКөрінбейтін болсаң да.\n\nКөрінбейтін Көктегі Әке,\nБір Өзіңе сиынамын мен.\nЖүрегімнен шыққан осы әніммен,\nБар әлемді жаратқан Ием,\nАспаннан нан жаудыртқан Ием,\n// Көрінбейтін Көктегі менің Әкем. //\n\nЖан жүрегім жылағанда,\nӘлсізденіп құлағанда,\nҰмтыламын Саған Әке,\nКөрінбейтін болсаң да.\n\nӨзің мені құтқарғанда,\nКөңілімді жұбатқанда.\nБасымды идім Саған Әке,\nКөрінбейтін болсаң да.',
    140, 'developer', 'published', true
WHERE NOT EXISTS (SELECT 1 FROM public.kwp_songs WHERE audio_url = 'https://repo.worshipleaderapp.com/mp3/KaigitartipKinalganda.mp3');

INSERT INTO public.kwp_songs (title, artist, is_unknown_author, permission_note, audio_url, storage_path, duration_seconds, lyrics, play_count, uploaded_by, status, is_active)
SELECT
    'Қымбатсың Сен маған әр күнде',
    'Майя Рахимгалиева',
    false,
    'Top #17 Kazakh worship (#5946 · worshipleaderapp.com)',
    'https://repo.worshipleaderapp.com/mp3/KimbatsinSen.mp3',
    NULL,
    256,
    E'// Қымбатсың Сен маған әр күнде,\nҚымбатсың Сен әрқашан күтем Сені Иса, жүрегім аңсайды Сені.\nСенімен боламын мәңгіге! //\n\n// Мен Саған өмірімді арнаймын,\nИса, мені Сен қолданшы.\nӘр күнде Сөзіңе ұмтыламын,\nТәңірім Саған мен сенемін. //',
    138, 'developer', 'published', true
WHERE NOT EXISTS (SELECT 1 FROM public.kwp_songs WHERE audio_url = 'https://repo.worshipleaderapp.com/mp3/KimbatsinSen.mp3');

INSERT INTO public.kwp_songs (title, artist, is_unknown_author, permission_note, audio_url, storage_path, duration_seconds, lyrics, play_count, uploaded_by, status, is_active)
SELECT
    'Сен, Тәңірім, күмістен де асыл',
    'DSJ',
    false,
    'Top #18 Kazakh worship (#6014 · worshipleaderapp.com)',
    'https://repo.worshipleaderapp.com/mp3/145%20Sen_%20T_n_irim_%20kumisten%20de%20asyl..mp3',
    NULL,
    178,
    E'Сен, Тәңірім, күмістен де асыл,\nСен, Тәңірім, алтыннан да қымбат.\nСен, Тәңірім, асылдың асылы.\nСен, Бағушым, менің Құдайым!\n\n// Сенен басқа Құтқарушым жоқ,\nСенен басқа арманым да жоқ,\nСенен басқа үмітім де жоқ.\nСен менің Құдайым! //',
    136, 'developer', 'published', true
WHERE NOT EXISTS (SELECT 1 FROM public.kwp_songs WHERE audio_url = 'https://repo.worshipleaderapp.com/mp3/145%20Sen_%20T_n_irim_%20kumisten%20de%20asyl..mp3');

INSERT INTO public.kwp_songs (title, artist, is_unknown_author, permission_note, audio_url, storage_path, duration_seconds, lyrics, play_count, uploaded_by, status, is_active)
SELECT
    'Тәңір Ием арамызда',
    'Блане Моррис',
    false,
    'Top #19 Kazakh worship (#6042 · worshipleaderapp.com)',
    'https://repo.worshipleaderapp.com/mp3/06%20_T_n_ir%20Iem%20aramyzda%20%20Dorozhka%206.mp3',
    NULL,
    316,
    E'// Тәңір Ием арамызда,\nКиелі, Киелі! //\n\n// Жоғарыда Ол мадақталсын\nҚұдіретті күшпен, қуанышпен.\nБилік етсін арамызда\nБүгіннен, мәңгіге, Аумин! //',
    134, 'developer', 'published', true
WHERE NOT EXISTS (SELECT 1 FROM public.kwp_songs WHERE audio_url = 'https://repo.worshipleaderapp.com/mp3/06%20_T_n_ir%20Iem%20aramyzda%20%20Dorozhka%206.mp3');

INSERT INTO public.kwp_songs (title, artist, is_unknown_author, permission_note, audio_url, storage_path, duration_seconds, lyrics, play_count, uploaded_by, status, is_active)
SELECT
    'Жол Ғолғотаға алыс, қиналып қарадың',
    'Белгісіз автор',
    true,
    'Top #20 Kazakh worship (#5860 · worshipleaderapp.com)',
    'https://repo.worshipleaderapp.com/mp3/59.%20Zhol%20G_olg_otag_a%20alys_%20k_inalyp%20k_aradyn_.mp3',
    NULL,
    256,
    E'Жол Ғолғотаға алыс, қиналып қарадың,\nЖараңнан тамшылап қаның ақты.\nО, Иса қымбаттым, мен үшін қиналдың,\nАзабын Өз еркіңмен көрдің.\n\nЕшқашан ұмытпаймын айқасқан ағашты,\nБайланыстырдың көк пенен жерді.\nӨлімің жарастырды бізді Құдаймен,\nТаза қаның бізді өтеді.\n\nАдамзат зер салшы, әнімді тыңдашы,\nНе үміт күтесің дүниеден.\nТөгілген қанына не төлем бересің,\nРақымы Құдайдың бағасыз.\n\nРақымдылығыңды Сен жерге жаудырдың,\nСоның сырын ашшы Сен бізге.\nНұсқаған жолыңмен қорықпай жүрейін,\nӨмірдің әр-қилы кезінде.',
    133, 'developer', 'published', true
WHERE NOT EXISTS (SELECT 1 FROM public.kwp_songs WHERE audio_url = 'https://repo.worshipleaderapp.com/mp3/59.%20Zhol%20G_olg_otag_a%20alys_%20k_inalyp%20k_aradyn_.mp3');

INSERT INTO public.kwp_songs (title, artist, is_unknown_author, permission_note, audio_url, storage_path, duration_seconds, lyrics, play_count, uploaded_by, status, is_active)
SELECT
    'Қолымды көкке жайып',
    'Белгісіз автор',
    true,
    'Top #21 Kazakh worship (#5971 · worshipleaderapp.com)',
    'https://repo.worshipleaderapp.com/mp3/13%20Track%2013.mp3',
    NULL,
    449,
    E'// Қолымды көкке жайып\nСүйем Сені.\nҚұтқардың азат еттің Ием менің.\nЖер көкте сиынарым бір Өзіңсің.\nӨмірдің болмас сірә Сенсіз сәні. //\n\nСүйемін Сені Иса, сүйем Сені.\nСүйемін Сені Иса, сүйем Сені Иса.',
    131, 'developer', 'published', true
WHERE NOT EXISTS (SELECT 1 FROM public.kwp_songs WHERE audio_url = 'https://repo.worshipleaderapp.com/mp3/13%20Track%2013.mp3');
