import React from 'react';
import styles from '@/styles/auth.module.scss';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.layout}>
      <div className={styles.card}>{children}</div>
    </div>
  );
}
