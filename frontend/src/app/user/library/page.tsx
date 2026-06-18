'use client';
import RowList from "@/components/Lists/RowList";
import { MusicCard } from "@/components/Cards";
import { useSearch } from "@/hooks/useObjects";
import { useUser } from "@/hooks/useUser";
import { useAuth } from "@/contexts/auth.context";
import { useEffect } from "react";
import { ArtistCard } from "@/components/Cards";

export default function Library() {
    const { isAuthenticated, loaded, user } = useAuth();

    const { results, searchTracks, searchAlbums, searchAll, searchArtists } = useSearch();
    const { favorites, fetchFavorites } = useUser();

    useEffect(() => {
        if (loaded && !isAuthenticated) return;
        // fetchFavorites();
        searchTracks();
        searchArtists(undefined, 4);
        searchAlbums();
    }, [loaded, isAuthenticated]);

    const likedTracks = favorites ?? [];
    const mixedTracks = results.tracks ?? [];
    const curatedTracks = results.tracks ?? [];
    const userAlbums = results.albums ?? [];
    const userArtists = results.artists ?? [];

    return (
        <main className="flex-1 min-w-0">
            <div className="pl-25.25 pr-61.5 pt-5.5 pb-5.5 flex flex-col gap-17 max-w-[940px]">
                <RowList>
                    {mixedTracks.map((t, i) => <MusicCard key={i} track={t} queue={mixedTracks} />)}
                </RowList>
                <RowList>
                    {curatedTracks.map((t, i) => <MusicCard key={i} track={t} queue={curatedTracks} />)}
                </RowList>
            </div>
            <div className="pl-25.25 pr-61.5 pt-5.5 pb-5.5 flex flex-col gap-17">
                {likedTracks.length ? (
                    <RowList>
                        {likedTracks.map((t, i) => <MusicCard key={i} track={t} queue={likedTracks} />)}
                    </RowList>
                ) : null}
                <RowList prevCount={5}>
                    {userAlbums.map((a, i) => <MusicCard key={i} track={a} queue={a.tracks || []} />)}
                </RowList>
            </div>
            <div className="flex flex-row min-w-0 gap-43.25 mx-auto w-fit">
                {userArtists.map((a, i) => <ArtistCard key={i} {...a} />)}
            </div>
        </main>
    );
}
