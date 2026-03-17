'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '@/styles/auth.module.scss';
import AuthInput from './AuthInput';
import AuthButton from './AuthButton';
import { loginUser, loginUserPanel, registerUser } from '@/lib/authService';

type Mode = 'login' | 'register';
type LoginPanel = 'admin' | 'user';

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
}

function validate(mode: Mode, name: string, email: string, password: string): FieldErrors {
  const errors: FieldErrors = {};
  if (mode === 'register' && !name.trim()) {
    errors.name = 'Name is required.';
  }
  if (!email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/.test(email)) {
    errors.email = 'Enter a valid email address.';
  }
  if (!password) {
    errors.password = 'Password is required.';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }
  return errors;
}

interface AuthFormProps {
  mode: Mode;
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const isRegister = mode === 'register';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [globalError, setGlobalError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginPanel, setLoginPanel] = useState<LoginPanel>('admin');
  const adminTabRef = useRef<HTMLButtonElement | null>(null);
  const userTabRef = useRef<HTMLButtonElement | null>(null);
  const panelId = 'login-panel';
  const adminTabId = 'login-tab-admin';
  const userTabId = 'login-tab-user';

  function handleTabKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      if (loginPanel === 'admin') {
        setLoginPanel('user');
        requestAnimationFrame(() => userTabRef.current?.focus());
      }
      return;
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      if (loginPanel === 'user') {
        setLoginPanel('admin');
        requestAnimationFrame(() => adminTabRef.current?.focus());
      }
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      setLoginPanel('admin');
      requestAnimationFrame(() => adminTabRef.current?.focus());
    }

    if (event.key === 'End') {
      event.preventDefault();
      setLoginPanel('user');
      requestAnimationFrame(() => userTabRef.current?.focus());
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGlobalError('');

    const errors = validate(mode, name, email, password);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setLoading(true);

    try {
      if (isRegister) {
        await registerUser({ name, email, password });
      } else if (loginPanel === 'user') {
        await loginUserPanel({ email, password });
      } else {
        await loginUser({ email, password });
      }
      router.replace('/');
    } catch (err: unknown) {
      setGlobalError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {!isRegister && (
        <div className={styles.panelTabs} role="tablist" aria-label="Login panel">
          <button
            ref={adminTabRef}
            id={adminTabId}
            type="button"
            role="tab"
            aria-controls={panelId}
            aria-selected={loginPanel === 'admin'}
            tabIndex={loginPanel === 'admin' ? 0 : -1}
            className={`${styles.panelTab} ${loginPanel === 'admin' ? styles.panelTabActive : ''}`}
            onClick={() => setLoginPanel('admin')}
            onKeyDown={handleTabKeyDown}
          >
            Admin Panel
          </button>
          <button
            ref={userTabRef}
            id={userTabId}
            type="button"
            role="tab"
            aria-controls={panelId}
            aria-selected={loginPanel === 'user'}
            tabIndex={loginPanel === 'user' ? 0 : -1}
            className={`${styles.panelTab} ${loginPanel === 'user' ? styles.panelTabActive : ''}`}
            onClick={() => setLoginPanel('user')}
            onKeyDown={handleTabKeyDown}
          >
            User Panel
          </button>
        </div>
      )}
      <div
        className={styles.panelContent}
        {...(!isRegister && {
          id: panelId,
          role: 'tabpanel',
          'aria-labelledby': loginPanel === 'admin' ? adminTabId : userTabId,
          tabIndex: 0,
        })}
      >
        {globalError && <div className={styles.globalError}>{globalError}</div>}

        {isRegister && (
          <AuthInput
            id="name"
            label="Full Name"
            type="text"
            placeholder="John Doe"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={fieldErrors.name}
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            }
          />
        )}

        <AuthInput
          id="email"
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={fieldErrors.email}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          }
        />

        <AuthInput
          id="password"
          label="Password"
          type="password"
          placeholder={isRegister ? 'Min. 6 characters' : '••••••••'}
          autoComplete={isRegister ? 'new-password' : 'current-password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldErrors.password}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          }
        />

        <AuthButton type="submit" loading={loading}>
          {isRegister ? 'Create Account' : 'Sign In'}
        </AuthButton>

        <div className={styles.footer}>
          {isRegister ? (
            <>Already have an account?{' '}<Link href="/login" className={styles.link}>Sign in</Link></>
          ) : (
            <>Don&apos;t have an account?{' '}<Link href="/register" className={styles.link}>Create one</Link></>
          )}
        </div>
      </div>
    </form>
  );
}
