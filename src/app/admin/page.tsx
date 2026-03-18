import type { Metadata } from 'next';
import styles from '@/styles/home.module.scss';
import SignOutButton from '@/components/auth/SignOutButton';

export const metadata: Metadata = {
    title: 'Admin',
};

export default function Admin() {
    return (
        <main className={styles.container}>
            <div className={styles.badge}>
                <span className={styles.dot} />
                Authenticated
            </div>
            <h1 className={styles.title}>
                Welcome to <span>Auth Plate: Admin Page</span>
            </h1>
            <p className={styles.description}>
                You are securely signed in. This is your protected dashboard — built with Next.js App Router, SCSS Modules, and JWT cookie authentication.
            </p>
            <div className={styles.actions}>
                <SignOutButton />
            </div>
        </main>
    );
}
