import React, { useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { Lock, Mail, Music2, X } from 'lucide-react';
import type { TranslationStrings } from '../i18n/translations';
import { isSupabaseConfigured, signInAdmin, signInWithGoogle, signUpUser } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  t: TranslationStrings;
  onClose: () => void;
  onAuthenticated: (session: Session | null, localEmail?: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  t,
  onClose,
  onAuthenticated,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);
    const trimmedEmail = email.trim();
    if (!trimmedEmail || password.length < 6) {
      setError(t.authPasswordPlaceholder);
      return;
    }

    setIsSubmitting(true);
    try {
      if (!isSupabaseConfigured) {
        onAuthenticated(null, trimmedEmail);
        return;
      }

      if (mode === 'signin') {
        const { session, error: signInError } = await signInAdmin(trimmedEmail, password);
        if (signInError) {
          setError(signInError);
          return;
        }
        if (session) {
          onAuthenticated(session);
        }
      } else {
        const { session, needsEmailConfirmation, error: signUpError } = await signUpUser(
          trimmedEmail,
          password
        );
        if (signUpError) {
          setError(signUpError);
          return;
        }
        if (session) {
          onAuthenticated(session);
          return;
        }
        if (needsEmailConfirmation) {
          setInfoMessage(t.authCheckEmailMsg);
          setMode('signin');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[390px] rounded-3xl bg-white p-6 shadow-2xl border border-black/[0.06] space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#FA243C]/10 text-[#FA243C] flex items-center justify-center shrink-0">
              <Music2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-tight text-[#1D1D1F]">
                {t.authGateTitle}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-[#F5F5F7] text-[#1D1D1F] flex items-center justify-center shrink-0 active:opacity-70"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs leading-relaxed text-[#6E6E73]">
          {t.authGateSubtitle}
        </p>

        {/* Continue with Google */}
        <button
          type="button"
          disabled={isSubmitting}
          onClick={async () => {
            setError(null);
            setInfoMessage(null);
            setIsSubmitting(true);
            try {
              const { error: googleError } = await signInWithGoogle();
              if (googleError) {
                setError(googleError);
              }
            } finally {
              setIsSubmitting(false);
            }
          }}
          className="w-full py-3 px-4 rounded-2xl bg-[#F5F5F7] hover:bg-[#EBEBF0] text-[#1D1D1F] text-sm font-semibold border border-black/[0.06] flex items-center justify-center gap-2.5 active:opacity-80 transition disabled:opacity-60"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
            />
          </svg>
          <span>{t.authGoogleBtn}</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-black/[0.08]" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#86868B]">
            {t.authOrDivider}
          </span>
          <div className="h-px flex-1 bg-black/[0.08]" />
        </div>

        {/* Sign In / Sign Up Switcher */}
        <div className="grid grid-cols-2 gap-1 p-1 rounded-2xl bg-[#F5F5F7]">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setError(null);
            }}
            className={`py-2 rounded-xl text-xs font-bold transition ${
              mode === 'signin'
                ? 'bg-white text-[#1D1D1F] shadow-xs'
                : 'text-[#86868B]'
            }`}
          >
            {t.authSignInTab}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError(null);
            }}
            className={`py-2 rounded-xl text-xs font-bold transition ${
              mode === 'signup'
                ? 'bg-white text-[#1D1D1F] shadow-xs'
                : 'text-[#86868B]'
            }`}
          >
            {t.authSignUpTab}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <Mail className="w-4 h-4 text-[#86868B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.authEmailPlaceholder}
              className="w-full bg-[#F5F5F7] rounded-2xl pl-10 pr-4 py-3 text-sm text-[#1D1D1F] placeholder:text-[#86868B] focus:outline-none focus:ring-2 focus:ring-[#FA243C]/30"
            />
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-[#86868B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              minLength={6}
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.authPasswordPlaceholder}
              className="w-full bg-[#F5F5F7] rounded-2xl pl-10 pr-4 py-3 text-sm text-[#1D1D1F] placeholder:text-[#86868B] focus:outline-none focus:ring-2 focus:ring-[#FA243C]/30"
            />
          </div>

          {error && (
            <p className="text-xs font-medium text-[#FA243C] bg-[#FA243C]/8 rounded-xl px-3 py-2">
              {error}
            </p>
          )}
          {infoMessage && (
            <p className="text-xs font-medium text-[#34C759] bg-[#34C759]/10 rounded-xl px-3 py-2">
              {infoMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-2xl bg-[#FA243C] text-white text-sm font-bold shadow-sm active:opacity-85 transition disabled:opacity-60"
          >
            {isSubmitting
              ? '...'
              : mode === 'signin'
              ? t.authSignInBtn
              : t.authSignUpBtn}
          </button>
        </form>
      </div>
    </div>
  );
};
