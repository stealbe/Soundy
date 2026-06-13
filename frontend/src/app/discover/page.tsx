'use client';
import RowList from "@/components/Lists/RowList";
import { MusicCard } from "@/components/Cards";
import { useSearch } from "@/hooks/useObjects";
import { useUser } from "@/hooks/useUser";
import { useAuth } from "@/contexts/auth.context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Discover() {
  const { isAuthenticated, loaded } = useAuth();
  const router = useRouter();

  const { results, searchTracks } = useSearch();
  const { favorites, fetchFavorites } = useUser();

  useEffect(() => {
    if (loaded && !isAuthenticated) router.push('/login');
  }, [loaded, isAuthenticated, router]);

  useEffect(() => {
    if (!loaded || !isAuthenticated) return;
    fetchFavorites();
    searchTracks();
  }, [loaded, isAuthenticated]);

  const likedTracks = favorites ?? [];
  const curatedTracks = results.tracks ?? [];

  return (
    <main className="flex-1 min-w-0">
      <div className="pl-25.25 pr-25.25 pt-5.5 pb-5.5">
        {likedTracks.length ? (
          <div>
            <h3>More of what you like</h3>
            <RowList>
              {likedTracks.map(t => <MusicCard key={t.id} {...t} />)}
            </RowList>
          </div>
        ) : (
          <div>
            <h3>Curated by Soundy</h3>
            <RowList>
              {curatedTracks.map(t => <MusicCard key={t.id} {...t} />)}
            </RowList>
          </div>
        )}

        {/* Recently played — пока нет эндпоинта на бэке, закомментировано */}
        {/* <div>
                    <h3>Recently played</h3>
                    <RowList>
                        {recentTracks.map(t => <MusicCard key={t.id} {...t} />)}
                    </RowList>
                </div> */}
      </div>
    </main>
  );
}
