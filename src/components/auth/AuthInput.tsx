'use client';

import React from 'react';
import styles from '@/styles/auth.module.scss';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: React.ReactNode;
  error?: string;
}

export default function AuthInput({ label, icon, error, id, ...rest }: AuthInputProps) {
  return (
    <div className={styles.fieldGroup}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <div className={styles.inputWrapper}>
        <span className={styles.inputIcon}>{icon}</span>
        <input
          id={id}
          className={`${styles.input} ${error ? styles.inputError : ''}`}
          {...rest}
        />
      </div>
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}
