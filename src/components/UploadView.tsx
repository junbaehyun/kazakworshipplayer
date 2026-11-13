import { useState, type FormEvent } from 'react';
import { CloudUpload, Link2, Music } from 'lucide-react';
import type { TranslationStrings } from '../i18n/translations';
import { uploadSong } from '../lib/supabase';
import type { Song } from '../types';

interface UploadViewProps {
  t: TranslationStrings;
  isAdmin: boolean;
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

export function UploadView({ t, isAdmin, onUploaded }: UploadViewProps) {
  const [mode, setMode] = useState<'url' | 'file'>('url');
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

  const MAX_FILE_BYTES = 20 * 1024 * 1024; // 20 MB cap for GAS + Google Drive free tier

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

  const hasAudioSource = mode === 'url' ? Boolean(externalUrl.trim()) : Boolean(file);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !hasAudioSource || !consent) return;

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
      });

      setFeedback(t.uploadSuccess);
      setTitle('');
      setArtist('');
      setLyrics('');
      setExternalUrl('');
      setFile(null);
      onUploaded(song);
    } catch (err) {
      console.error(err);
      setFeedback('Upload failed. Please try again.');
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

      {/* Mode Switch: Link MP3 URL (0 Storage) vs Upload MP3 File */}
      <div className="grid grid-cols-2 gap-1.5 bg-white p-1 rounded-xl border border-black/[0.06]">
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
            mode === 'url' ? 'bg-[#FA243C] text-white' : 'text-[#86868B]'
          }`}
        >
          <Link2 className="w-3.5 h-3.5" />
          <span>MP3 URL Link</span>
        </button>
        <button
          type="button"
          onClick={() => setMode('file')}
          className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
            mode === 'file' ? 'bg-[#FA243C] text-white' : 'text-[#86868B]'
          }`}
        >
          <Music className="w-3.5 h-3.5" />
          <span>Upload MP3</span>
        </button>
      </div>

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

      <div className="space-y-1">
        <label className="block text-xs font-semibold text-[#1D1D1F]">{t.lyricsLabel}</label>
        <textarea
          rows={3}
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
        disabled={isSubmitting || !hasAudioSource || !title.trim() || !consent}
        className="w-full py-3 rounded-xl bg-[#FA243C] disabled:opacity-50 text-white font-bold text-xs shadow-sm active:scale-[0.99] transition"
      >
        {isSubmitting ? t.uploadingBtn : `＋ ${t.uploadSubmitBtn}`}
      </button>
    </form>
  );
}
