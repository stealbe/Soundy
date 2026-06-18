'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import RowList from "@/components/Lists/RowList";
import { MusicCard } from "@/components/Cards";
import { useSearch } from "@/hooks/useObjects";
import { useUser } from "@/hooks/useUser";
import { useAuth } from "@/contexts/auth.context";
import styles from "./Discover.module.css";

export default function Discover() {
  const { isAuthenticated, loaded, user } = useAuth();
  const router = useRouter();

  const { results, searchAll } = useSearch();
  const { favorites } = useUser();

  useEffect(() => {
    if (loaded && !isAuthenticated) {
      router.push('/');
    }
  }, [loaded, isAuthenticated, router]);

  useEffect(() => {
    if (loaded && !isAuthenticated) return;
    searchAll();
  }, [loaded, isAuthenticated]);

  const likedTracks = favorites ?? [];
  const mixedTracks = results.tracks ?? [];
  const curatedTracks = results.tracks ?? [];
  const userAlbums = results.albums ?? [];

  return (
    <main className={styles.discoverPage}>


      {likedTracks.length > 0 && (
        <div className={styles.contentGrid}>
          <section className={styles.sectionBlock}>
            <h3 className={styles.sectionTitle}>More of what you like</h3>
            <RowList>
              {likedTracks.map((t, i) => (
                <MusicCard key={i} track={t} queue={likedTracks} />
              ))}
            </RowList>
          </section>
        </div>
      )}


      <div className={styles.bannerContainer}>
        <Image
          width={1920}
          height={662}
          className={styles.bannerImage}
          src="/SubBanner.png"
          alt="Sub banner"
          priority
        />
      </div>


      <div className={styles.contentGrid}>


        <section className={styles.sectionBlock}>
          <div className={styles.mixedTitleWrapper}>
            <h3 className={styles.sectionTitle}>Mixed for</h3>
            <p className={styles.usernameText}>{user?.username}</p>
          </div>
          <RowList>
            {mixedTracks.map((t, i) => (
              <MusicCard key={i} track={t} queue={mixedTracks} />
            ))}
          </RowList>
        </section>


        <section className={styles.sectionBlock}>
          <h3 className={styles.sectionTitle}>Curated by Soundy</h3>
          <RowList>
            {curatedTracks.map((t, i) => (
              <MusicCard key={i} track={t} queue={curatedTracks} />
            ))}
          </RowList>
        </section>


        <section className={styles.sectionBlock}>
          <h3 className={styles.sectionTitle}>Albums for you</h3>
          <RowList>
            {userAlbums.map((a, i) => (
              <MusicCard key={i} track={a} queue={a.tracks || []} />
            ))}
          </RowList>
        </section>

      </div>
    </main>
  );
}
