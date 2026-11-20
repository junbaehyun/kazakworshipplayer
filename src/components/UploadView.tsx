import { useState, type FormEvent } from 'react';
import { BookOpen, CloudUpload, Link2, Music, ShieldCheck } from 'lucide-react';
import type { TranslationStrings } from '../i18n/translations';
import { uploadSong } from '../lib/supabase';
import type { Language, Song } from '../types';

interface UploadViewProps {
  t: TranslationStrings;
  lang: Language;
  isAdmin: boolean;
  uploaderEmail?: string | null;
  onUploaded: (song: Song) => void;
}

function getAudioDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const audio = new Audio();
    const url = URL.createObjectURL(file);
    audio.src = url;
    audio.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(Number.isFinite(audio.duration) ? audio.duration : 0);
    };
    audio.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(0);
    };
  });
}

export function UploadView({
  t,
  lang,
  isAdmin,
  uploaderEmail = null,
  onUploaded,
}: UploadViewProps) {
  const [mode, setMode] = useState<'file' | 'url' | 'lyrics'>('file');
  const [songLang, setSongLang] = useState<'kk' | 'ru'>('kk');
  const [songKey, setSongKey] = useState('');
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [isUnknownAuthor, setIsUnknownAuthor] = useState(true);
  const [lyrics, setLyrics] = useState('');
  const [externalUrl, setExternalUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [consent, setConsent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const MAX_FILE_BYTES = 20 * 1024 * 1024; // 20 MB cap for GAS + Storage free tier

  const handleFileChange = (selected: File | null) => {
    setErrorMsg(null);
    if (!selected) {
      setFile(null);
      return;
    }
    if (!selected.type.startsWith('audio/') && !/\.(mp3|m4a|wav|ogg|aac)$/i.test(selected.name)) {
      setErrorMsg('Only audio files (.mp3, .m4a, .wav, .ogg) are allowed.');
      setFile(null);
      return;
    }
    if (selected.size > MAX_FILE_BYTES) {
      setErrorMsg('File is too large (max 20 MB per song to keep storage free).');
      setFile(null);
      return;
    }
    setFile(selected);
  };

  const hasRequiredContent =
    mode === 'url'
      ? Boolean(externalUrl.trim())
      : mode === 'file'
      ? Boolean(file)
      : Boolean(lyrics.trim());

  const pendingSuccessNotice =
    lang === 'ko'
      ? '제출 완료! 관리자 승인 후 모든 사용자에게 공개됩니다.'
      : lang === 'kk'
      ? 'Жіберілді! Әкімші растағаннан кейін жарияланады.'
      : lang === 'ru'
      ? 'Отправлено! Песня появится после одобрения администратором.'
      : 'Submitted! Your song will go live after admin approval.';

  const adminLiveSuccessNotice =
    lang === 'ko'
      ? '관리자 권한으로 즉시 라이브 등록되었습니다.'
      : lang === 'kk'
      ? 'Әкімші ретінде бірден жарияланды.'
      : lang === 'ru'
      ? 'Опубликовано сразу (администратор).'
      : 'Published live immediately (Admin).';

  const pendingHeaderNotice =
    lang === 'ko'
      ? '곡을 올리면 관리자 계정에서 확인·승인한 뒤 전체 목록에 공개됩니다.'
      : lang === 'kk'
      ? 'Қосқан әніңіз әкімші тексеріп растағаннан кейін барлық тыңдаушыларға ашылады.'
      : lang === 'ru'
      ? 'После отправки песня появится в общем списке после проверки администратором.'
      : 'Uploaded songs are reviewed and go live once approved by an admin.';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !hasRequiredContent || !consent) return;

    setIsSubmitting(true);
    setFeedback(null);
    setErrorMsg(null);
    try {
      const durationSeconds = mode === 'file' && file ? await getAudioDuration(file) : 0;
      const { song } = await uploadSong({
        title,
        artist,
        isUnknownAuthor,
        lyrics,
        file: mode === 'file' ? file : null,
        externalUrl: mode === 'url' ? externalUrl : '',
        durationSeconds,
        isAdmin,
        lang: songLang,
        songKey,
        uploaderEmail,
      });

      setFeedback(isAdmin ? adminLiveSuccessNotice : pendingSuccessNotice);
      setTitle('');
      setArtist('');
      setSongKey('');
      setLyrics('');
      setExternalUrl('');
      setFile(null);
      onUploaded(song);
    } catch (err) {
      console.error(err);
      setErrorMsg('Upload failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#F5F5F7] rounded-2xl p-4 space-y-3.5">
      <div>
        <h2 className="text-sm font-extrabold text-[#1D1D1F] flex items-center gap-1.5">
          <CloudUpload className="w-4 h-4 text-[#FA243C]" />
          <span>{t.uploadTitle}</span>
        </h2>
        <p className="text-xs text-[#86868B] mt-0.5">{t.uploadSubtitle}</p>
      </div>

      {!isAdmin && (
        <div className="rounded-xl bg-white border border-black/[0.06] px-3 py-2 flex items-start gap-2 text-[11px] text-[#515154]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#FA243C] shrink-0 mt-0.5" />
          <span>{pendingHeaderNotice}</span>
        </div>
      )}

      <div className="space-y-1">
        <label className="block text-xs font-semibold text-[#1D1D1F]">{t.songTitleLabel}</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t.songTitlePlaceholder}
          className="w-full bg-white rounded-xl px-3.5 py-2.5 text-xs text-[#1D1D1F] border border-black/[0.06] focus:outline-none focus:ring-2 focus:ring-[#FA243C]/30"
        />
      </div>

      {/* Song Language & Optional Guitar Key */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-[#1D1D1F]">Language</label>
          <div className="grid grid-cols-2 gap-1 bg-white p-1 rounded-xl border border-black/[0.06]">
            <button
              type="button"
              onClick={() => setSongLang('kk')}
              className={`py-1.5 rounded-lg text-[11px] font-bold transition ${
                songLang === 'kk' ? 'bg-[#1D1D1F] text-white' : 'text-[#86868B]'
              }`}
            >
              Қазақша
            </button>
            <button
              type="button"
              onClick={() => setSongLang('ru')}
              className={`py-1.5 rounded-lg text-[11px] font-bold transition ${
                songLang === 'ru' ? 'bg-[#1D1D1F] text-white' : 'text-[#86868B]'
              }`}
            >
              Русский
            </button>
          </div>
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-[#1D1D1F]">Key (Optional)</label>
          <input
            type="text"
            value={songKey}
            onChange={(e) => setSongKey(e.target.value)}
            placeholder="e.g. C, Dm, G"
            maxLength={8}
            className="w-full bg-white rounded-xl px-3.5 py-2 text-xs text-[#1D1D1F] border border-black/[0.06] focus:outline-none focus:ring-2 focus:ring-[#FA243C]/30"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs font-medium text-[#1D1D1F] cursor-pointer">
          <input
            type="checkbox"
            checked={isUnknownAuthor}
            onChange={(e) => setIsUnknownAuthor(e.target.checked)}
            className="accent-[#FA243C] w-4 h-4"
          />
          <span>{t.unknownAuthorCheck}</span>
        </label>

        {!isUnknownAuthor && (
          <input
            type="text"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder={t.authorLabel}
            className="w-full bg-white rounded-xl px-3.5 py-2.5 text-xs text-[#1D1D1F] border border-black/[0.06] focus:outline-none focus:ring-2 focus:ring-[#FA243C]/30"
          />
        )}
      </div>

      {/* Mode Switch: Upload MP3 File vs MP3 URL Link vs Lyrics Only */}
      <div className="grid grid-cols-3 gap-1 bg-white p-1 rounded-xl border border-black/[0.06]">
        <button
          type="button"
          onClick={() => setMode('file')}
          className={`py-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition ${
            mode === 'file' ? 'bg-[#FA243C] text-white' : 'text-[#86868B]'
          }`}
        >
          <Music className="w-3.5 h-3.5" />
          <span>Upload MP3</span>
        </button>
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`py-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition ${
            mode === 'url' ? 'bg-[#FA243C] text-white' : 'text-[#86868B]'
          }`}
        >
          <Link2 className="w-3.5 h-3.5" />
          <span>MP3 URL</span>
        </button>
        <button
          type="button"
          onClick={() => setMode('lyrics')}
          className={`py-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition ${
            mode === 'lyrics' ? 'bg-[#FA243C] text-white' : 'text-[#86868B]'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Lyrics Only</span>
        </button>
      </div>

      {mode !== 'lyrics' && (
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-[#1D1D1F]">{t.audioFileLabel}</label>
          {mode === 'url' ? (
            <>
              <input
                type="url"
                required
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
                placeholder="https://example.com/song.mp3"
                className="w-full bg-white rounded-xl px-3.5 py-2.5 text-xs text-[#1D1D1F] border border-black/[0.06] focus:outline-none focus:ring-2 focus:ring-[#FA243C]/30"
              />
              <p className="text-[11px] text-[#86868B]">Uses 0 server storage · Streams directly</p>
            </>
          ) : (
            <>
              <label className="flex flex-col items-center justify-center gap-1.5 bg-white border border-dashed border-black/15 rounded-xl p-4 cursor-pointer active:bg-black/[0.02]">
                <Music className="w-5 h-5 text-[#FA243C]" />
                <span className="text-xs font-medium text-[#1D1D1F] truncate max-w-full">
                  {file ? file.name : t.audioFileHint}
                </span>
                <input
                  type="file"
                  accept="audio/*,.mp3,.m4a,.wav,.ogg"
                  required
                  onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
              <p className="text-[11px] text-[#86868B]">Max 20 MB · Cached locally after first play</p>
            </>
          )}
        </div>
      )}

      <div className="space-y-1">
        <label className="block text-xs font-semibold text-[#1D1D1F]">{t.lyricsLabel}</label>
        <textarea
          rows={mode === 'lyrics' ? 6 : 3}
          required={mode === 'lyrics'}
          value={lyrics}
          onChange={(e) => setLyrics(e.target.value)}
          placeholder={t.lyricsPlaceholder}
          className="w-full bg-white rounded-xl px-3.5 py-2.5 text-xs text-[#1D1D1F] border border-black/[0.06] focus:outline-none focus:ring-2 focus:ring-[#FA243C]/30"
        />
      </div>

      <label className="flex items-start gap-2 text-xs text-[#515154] cursor-pointer">
        <input
          type="checkbox"
          required
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 accent-[#FA243C] w-4 h-4 shrink-0"
        />
        <span>{t.uploadConsent}</span>
      </label>

      {errorMsg && (
        <div className="bg-[#FA243C]/10 text-[#FA243C] text-xs font-semibold rounded-xl px-3 py-2">
          {errorMsg}
        </div>
      )}

      {feedback && (
        <div className="bg-[#34C759]/15 text-[#1D1D1F] text-xs font-semibold rounded-xl px-3 py-2">
          ✓ {feedback}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || !hasRequiredContent || !title.trim() || !consent}
        className="w-full py-3 rounded-xl bg-[#FA243C] disabled:opacity-50 text-white font-bold text-xs shadow-sm active:scale-[0.99] transition"
      >
        {isSubmitting ? t.uploadingBtn : `＋ ${t.uploadSubmitBtn}`}
      </button>
    </form>
  );
}
