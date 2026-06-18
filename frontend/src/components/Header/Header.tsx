'use client';
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/auth.context";
import styles from "./Header.module.css";

export default function Header() {
  const { user, loaded } = useAuth();

  const profileHref = user && loaded ? `/${user.username}` : '/login';  

  return (
    <header className={styles.header}>


      <div className={styles.leftSection}>
        <Link href="/" className={styles.logo}>
          <Image
            width={35}
            height={35}
            src="/mainLogo.svg"
            alt="Soundy Logo"
            priority
          />
          <span className={styles.logoText}>Soundy</span>
        </Link>

        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>Home</Link>
          <Link href="/feed" className={styles.navLink}>Feed</Link>
          <Link href="/library" className={styles.navLink}>Library</Link>
        </nav>
      </div>


      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search"
          className={styles.searchInput}
        />
        <Image
          src="/searchIcon.svg"
          width={16}
          height={16}
          alt="Search"
          className={styles.searchIcon}
        />
      </div>


      <div className={styles.rightSection}>
        <Link href="/pro" className={styles.proLink}>Try Artist Pro</Link>
        <Link href="/studio" className={styles.studioLink}>Artist Studio</Link>


        <Link href={profileHref} className={styles.userWrapper}>
          <Image
            width={32}
            height={32}
            className={styles.avatar}
            src={(user && loaded && user.avatar_url) || '/no-avatar.webp'}
            alt="User Avatar"
          />
          <Image
            src="/chevronDown.svg"
            width={12}
            height={12}
            alt="Dropdown"
            className={styles.chevronIcon}
          />
        </Link>


        <div className={styles.iconGroup}>

          <button className={styles.iconButton} aria-label="Notifications">
            <span className={styles.notificationBadge} />
            <Image src="/header/bell.svg" width={20} height={20} alt="Notifications" />
          </button>


          <button className={styles.iconButton} aria-label="Messages">
            <Image src="/header/mail.svg" width={20} height={20} alt="Messages" />
          </button>


          <button className={styles.iconButton} aria-label="More options">
            <Image src="/header/dots.svg" width={20} height={20} alt="More options" />
          </button>
        </div>

      </div>
    </header>
  );
}
