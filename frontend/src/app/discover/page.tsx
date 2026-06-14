'use client';
import RowList from "@/components/Lists/RowList";
import { MusicCard } from "@/components/Cards";
import { useSearch } from "@/hooks/useObjects";
import { useUser } from "@/hooks/useUser";
import { useAuth } from "@/contexts/auth.context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import { usePlayer } from "@/contexts/player.context";

export default function Discover() {
  const { isAuthenticated, loaded, user } = useAuth();
  
  const router = useRouter();

  const { results, searchTracks, searchAlbums } = useSearch();
  const { favorites, fetchFavorites } = useUser();
  const { registerPlaylist, playFromList } = usePlayer();

  useEffect(() => {
    if (loaded && !isAuthenticated) router.push('/');
  }, [loaded, isAuthenticated, router]);

  useEffect(() => {
    if (!loaded || !isAuthenticated) return;
    fetchFavorites();
    searchTracks();
    searchAlbums();
  }, [loaded, isAuthenticated]);

  const likedTracks = favorites ?? [];
  const curatedTracks = results.tracks ?? [];
  const userAlbums = results.albums ?? [];

  useEffect(() => {
    if (likedTracks.length) registerPlaylist('liked', likedTracks);
  }, [likedTracks.length]);

  useEffect(() => {
    if (curatedTracks.length) registerPlaylist('curated', curatedTracks);
  }, [curatedTracks.length]);

  useEffect(() => {
    userAlbums.forEach(a => {
      if (a.tracks?.length) registerPlaylist(a.id, a.tracks);
    });
  }, [userAlbums.length]);

  return (
    <main className="flex-1 min-w-0">
      <div className="pl-25.25 pr-61.5 pt-5.5 pb-5.5 flex flex-col gap-17">
        {likedTracks.length ? (
          <div>
            <h3 className="font-extrabold">More of what you like</h3>
            <RowList>
              {likedTracks.map((t, i) => <MusicCard key={i} track={t} onPlay={() => playFromList('liked', t.index ?? 0)} />)}
            </RowList>
          </div>
        ) : null}

        {/* Recently played — пока нет эндпоинта на бэке, закомментировано */}
        {/* <div>
                    <h3 className="font-extrabold">Recently played</h3>
                    <RowList>
                        {recentTracks.map(t => <MusicCard key={t.id} {...t} />)}
                    </RowList>
                </div> */}
      </div>
      <Image width={1920} height={662} className="w-full h-fit" src={'/SubBanner.png'} alt="Sub banner" />
      <div className="pl-25.25 pr-61.5 pt-5.5 pb-5.5 flex flex-col gap-17">
        <div>
          <span className="flex gap-1"><h3 className="font-extrabold">Mixed for</h3><p className="font-extralight">{user?.username}</p></span>
          <RowList>
            {curatedTracks.map((t, i) => <MusicCard key={i} track={t} onPlay={() => { playFromList('curated', t.index ?? 0); console.log(t.index) }} />)}
          </RowList>
        </div>
        <div>
          <h3 className="font-extrabold">Curated by Soundy</h3>
          <RowList>
            {curatedTracks.map((t, i) => <MusicCard key={i} track={t} onPlay={() => playFromList('curated', t.index ?? 0)} />)}
          </RowList>
        </div>
        <div>
          <h3 className="font-extrabold">Albums for you</h3>
          <RowList>
            {userAlbums.map((a, i) => <MusicCard key={i} track={a} onPlay={() => playFromList(a.id, 0)} />)}
          </RowList>
        </div>
        {/* {trendingGenries.length ?
          <div>
            <h3 className="font-extrabold">Trending By Genre</h3>
            <RowList>
              {trendingGenries.map((t, i) => <MusicCard key={i} {...t} />)}
            </RowList>
          </div> : null
        } */}
      </div>
    </main>
  );
}
