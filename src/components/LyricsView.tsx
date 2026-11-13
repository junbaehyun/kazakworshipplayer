import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, Copy, Music2, X } from 'lucide-react';

interface Stanza {
  tag: string | null;
  lines: string[];
}

interface LyricsViewProps {
  lyrics: string;
  title: string;
  author: string;
  gradient: string;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  lyricsLabel: string;
  onSeek: (time: number) => void;
  onClose: () => void;
}

const FONT_SIZE_CLASSES = [
  'text-[15px] leading-[1.6]',
  'text-[18px] leading-[1.65]',
  'text-[21px] leading-[1.7]',
] as const;

function parseStanzas(raw: string): Stanza[] {
  const trimmed = raw.trim();
  if (!trimmed) return [];

  return trimmed
    .split(/\n\s*\n/)
    .map((block) => {
      const lines = block
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean);
      if (lines.length === 0) return null;

      const tagMatch = lines[0].match(/^\[([^\]]+)\]$/);
      if (tagMatch) {
        return {
          tag: tagMatch[1],
          lines: lines.slice(1),
        };
      }
      return { tag: null, lines };
    })
    .filter((s): s is Stanza => s !== null && s.lines.length > 0);
}

export function LyricsView({
  lyrics,
  title,
  author,
  gradient,
  currentTime,
  duration,
  isPlaying,
  lyricsLabel,
  onSeek,
  onClose,
}: LyricsViewProps) {
  const [fontStep, setFontStep] = useState<0 | 1 | 2>(1);
  const [copied, setCopied] = useState(false);
  const lastManualScrollRef = useRef(0);
  const stanzaRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const stanzas = useMemo(() => parseStanzas(lyrics), [lyrics]);

  const activeIndex = useMemo(() => {
    if (stanzas.length <= 1 || duration <= 0) return 0;
    const progress = Math.min(0.999, Math.max(0, currentTime / duration));
    return Math.min(stanzas.length - 1, Math.floor(progress * stanzas.length));
  }, [stanzas.length, currentTime, duration]);

  useEffect(() => {
    if (!isPlaying || stanzas.length <= 1) return;
    if (Date.now() - lastManualScrollRef.current < 3000) return;

    const el = stanzaRefs.current[activeIndex];
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [activeIndex, isPlaying, stanzas.length]);

  const handleCopy = async () => {
    if (!lyrics.trim()) return;
    try {
      await navigator.clipboard.writeText(lyrics.trim());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Ignore clipboard errors in restricted contexts
    }
  };

  return (
    <div className="flex-1 min-h-0 my-3 bg-white/80 backdrop-blur-xl rounded-3xl border border-black/[0.06] shadow-[0_12px_36px_rgba(0,0,0,0.06)] flex flex-col overflow-hidden">
      {/* Compact Lyrics Header */}
      <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-black/[0.05] shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shrink-0 shadow-sm`}
          >
            <Music2 className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-[#1D1D1F] truncate">{title}</p>
            <p className="text-[11px] font-medium text-[#86868B] truncate">{author}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setFontStep((s) => (s > 0 ? ((s - 1) as 0 | 1 | 2) : 0))}
            disabled={fontStep === 0}
            aria-label="Decrease lyrics font size"
            className="px-2 py-1 rounded-lg bg-[#F5F5F7] text-[11px] font-bold text-[#1D1D1F] disabled:opacity-35 active:scale-95 transition"
          >
            A-
          </button>
          <button
            type="button"
            onClick={() => setFontStep((s) => (s < 2 ? ((s + 1) as 0 | 1 | 2) : 2))}
            disabled={fontStep === 2}
            aria-label="Increase lyrics font size"
            className="px-2 py-1 rounded-lg bg-[#F5F5F7] text-[11px] font-bold text-[#1D1D1F] disabled:opacity-35 active:scale-95 transition"
          >
            A+
          </button>
          <button
            type="button"
            onClick={() => void handleCopy()}
            disabled={!lyrics.trim()}
            aria-label="Copy lyrics"
            className="p-1.5 rounded-lg bg-[#F5F5F7] text-[#1D1D1F] disabled:opacity-35 active:scale-95 transition"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-[#34C759]" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label={`Close ${lyricsLabel}`}
            className="p-1.5 rounded-lg bg-[#F5F5F7] text-[#86868B] hover:text-[#1D1D1F] active:scale-95 transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Scrollable Stanzas with Soft Edge Fade */}
      <div
        onWheel={() => {
          lastManualScrollRef.current = Date.now();
        }}
        onTouchMove={() => {
          lastManualScrollRef.current = Date.now();
        }}
        style={{
          maskImage:
            'linear-gradient(to bottom, transparent 0%, black 6%, black 92%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent 0%, black 6%, black 92%, transparent 100%)',
        }}
        className="flex-1 overflow-y-auto px-5 py-6 space-y-6"
      >
        {stanzas.length === 0 ? (
          <p className="text-sm font-medium text-[#86868B] text-center py-10">—</p>
        ) : (
          stanzas.map((stanza, idx) => {
            const isActive = idx === activeIndex;
            const targetTime = duration > 0 ? (idx / stanzas.length) * duration : 0;

            return (
              <button
                key={`${stanza.tag ?? 's'}-${idx}`}
                ref={(el) => {
                  stanzaRefs.current[idx] = el;
                }}
                type="button"
                onClick={() => {
                  if (duration > 0) onSeek(targetTime);
                }}
                className={`w-full text-left rounded-2xl px-3 py-2 transition-all duration-300 ${
                  isActive
                    ? 'bg-[#FA243C]/[0.06] text-[#1D1D1F] opacity-100'
                    : 'text-[#1D1D1F]/40 hover:text-[#1D1D1F]/70'
                }`}
              >
                {stanza.tag && (
                  <span className="inline-block mb-1.5 px-2.5 py-0.5 rounded-full bg-[#FA243C]/12 text-[#FA243C] text-[10px] font-extrabold uppercase tracking-wider">
                    {stanza.tag}
                  </span>
                )}
                <div className={`font-bold tracking-[-0.01em] space-y-1 ${FONT_SIZE_CLASSES[fontStep]}`}>
                  {stanza.lines.map((line, lineIdx) => (
                    <p key={lineIdx}>{line}</p>
                  ))}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
