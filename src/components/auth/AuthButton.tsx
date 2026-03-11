'use client';

import React from 'react';
import styles from '@/styles/auth.module.scss';

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children: React.ReactNode;
}

export default function AuthButton({ loading, children, disabled, ...rest }: AuthButtonProps) {
  return (
    <button className={styles.button} disabled={disabled || loading} {...rest}>
      <span className={styles.buttonInner}>
        {loading && <span className={styles.spinner} />}
        {children}
      </span>
    </button>
  );
}
