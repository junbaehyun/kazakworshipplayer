import { useState, type FormEvent } from 'react';
import { Mail, X } from 'lucide-react';
import type { TranslationStrings } from '../i18n/translations';
import { submitReport } from '../lib/supabase';
import type { ReportType, Song } from '../types';

interface NoticeReportSheetProps {
  isOpen: boolean;
  targetSong: Song | null;
  t: TranslationStrings;
  onClose: () => void;
}

export function NoticeReportSheet({ isOpen, targetSong, t, onClose }: NoticeReportSheetProps) {
  const [reportType, setReportType] = useState<ReportType>(
    targetSong ? 'claim_authorship' : 'message'
  );
  const [songTitle, setSongTitle] = useState(targetSong?.title || '');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!contact.trim() || !message.trim()) return;
    setIsSending(true);
    await submitReport({
      songId: targetSong?.id || null,
      songTitle: songTitle || targetSong?.title || 'General Message',
      reportType,
      reporterContact: contact,
      message,
    });
    setIsSending(false);
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setContact('');
      setMessage('');
      onClose();
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-end justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-[430px] rounded-t-3xl p-5 space-y-3.5 shadow-2xl border-t border-black/5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-[#1D1D1F]">{t.noticeModalTitle}</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#F5F5F7] flex items-center justify-center text-[#86868B]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-[#515154] leading-relaxed">{t.noticeModalBody}</p>

        <div className="text-xs font-semibold text-[#1D1D1F] flex items-center gap-1.5">
          <Mail className="w-3.5 h-3.5 text-[#FA243C]" />
          <a href="mailto:junbaehyun.kz@gmail.com" className="text-[#FA243C] underline">
            junbaehyun.kz@gmail.com
          </a>
        </div>

        {sent ? (
          <div className="bg-[#34C759]/15 text-[#1D1D1F] text-xs font-bold rounded-xl p-4 text-center">
            ✓ {t.reportSuccess}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-2.5">
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as ReportType)}
              className="w-full bg-[#F5F5F7] rounded-xl px-3.5 py-2.5 text-xs text-[#1D1D1F] focus:outline-none"
            >
              <option value="claim_authorship">{t.reportTypeClaim}</option>
              <option value="request_removal">{t.reportTypeRemove}</option>
              <option value="message">{t.reportTypeMessage}</option>
            </select>

            <input
              type="text"
              value={songTitle || targetSong?.title || ''}
              onChange={(e) => setSongTitle(e.target.value)}
              placeholder={t.songTitlePlaceholder}
              className="w-full bg-[#F5F5F7] rounded-xl px-3.5 py-2.5 text-xs text-[#1D1D1F] focus:outline-none"
            />

            <input
              type="text"
              required
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder={t.reportContactPlaceholder}
              className="w-full bg-[#F5F5F7] rounded-xl px-3.5 py-2.5 text-xs text-[#1D1D1F] focus:outline-none"
            />

            <textarea
              rows={3}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t.reportMessagePlaceholder}
              className="w-full bg-[#F5F5F7] rounded-xl px-3.5 py-2.5 text-xs text-[#1D1D1F] focus:outline-none"
            />

            <button
              type="submit"
              disabled={isSending}
              className="w-full py-3 rounded-xl bg-[#FA243C] text-white text-xs font-bold shadow-sm active:scale-[0.99] transition"
            >
              {isSending ? '...' : t.reportSubmitBtn}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
