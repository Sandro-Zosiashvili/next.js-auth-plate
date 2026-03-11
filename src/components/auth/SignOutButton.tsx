'use client';

import { useRouter } from 'next/navigation';
import { logoutUser } from '@/lib/authService';
import styles from '@/styles/home.module.scss';

export default function SignOutButton() {
  const router = useRouter();

  function handleSignOut() {
    logoutUser();
    router.replace('/login');
  }

  return (
    <button className={styles.buttonPrimary} onClick={handleSignOut}>
      Sign Out
    </button>
  );
}
