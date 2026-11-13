import React, { useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { Lock, Mail, Music2, X } from 'lucide-react';
import type { TranslationStrings } from '../i18n/translations';
import { isSupabaseConfigured, signInAdmin, signUpUser } from '../lib/supabase';

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
