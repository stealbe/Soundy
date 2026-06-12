import RowList from "@/components/Lists/RowList";
import { MusicCard } from "@/components/Cards";

interface Artist {
  id: number;
  name: string;
  cover: string;
  tracks: number;
  subscribers: number;
  following?: boolean;
}

interface Track {
  id: number;
  title: string;
  artists: Artist[];
  cover: string;
  play_count: number;
  likes: number;
  reposts: number;
  comments: number;
}

const SUGGESTED_ARTISTS: Artist[] = [
  { id: 1, name: "XDswagg", cover: "https://static.codia.ai/image/2026-06-12/42ZZHQOft7.png", tracks: 16, subscribers: 120 },
  { id: 2, name: "laydown", cover: "https://static.codia.ai/image/2026-06-12/nZ51t169o6.png", tracks: 16, subscribers: 120 },
  { id: 3, name: "rira_fa", cover: "https://static.codia.ai/image/2026-06-12/VnMokxs3xx.png", tracks: 16, subscribers: 120 },
];

const LIKED_TRACKS: Track[] = [
  {
    id: 1, title: "Don't waste my time",
    artists: [SUGGESTED_ARTISTS[1], SUGGESTED_ARTISTS[2]],
    cover: "https://static.codia.ai/image/2026-06-12/UP6nM8nzNJ.png",
    play_count: 10_000, likes: 1_010, reposts: 80_000, comments: 2456,
  },
  {
    id: 2, title: "Don't waste my time",
    artists: [SUGGESTED_ARTISTS[1], SUGGESTED_ARTISTS[2]],
    cover: "https://static.codia.ai/image/2026-06-12/2JOo69F8wh.png",
    play_count: 10_000, likes: 1_010, reposts: 80_000, comments: 2456,
  },
  {
    id: 3, title: "Don't waste my time",
    artists: [SUGGESTED_ARTISTS[1], SUGGESTED_ARTISTS[2]],
    cover: "https://static.codia.ai/image/2026-06-12/7njksXoWoj.png",
    play_count: 10_000, likes: 1_010, reposts: 80_000, comments: 2456,
  },
];

const RECENTLY_PLAYED: Track[] = [
  {
    id: 1, title: "Don't waste my time",
    artists: [SUGGESTED_ARTISTS[1], SUGGESTED_ARTISTS[2]],
    cover: "https://static.codia.ai/image/2026-06-12/UP6nM8nzNJ.png",
    play_count: 10_000, likes: 1_010, reposts: 80_000, comments: 2456,
  },
  {
    id: 2, title: "Don't waste my time",
    artists: [SUGGESTED_ARTISTS[1], SUGGESTED_ARTISTS[2]],
    cover: "https://static.codia.ai/image/2026-06-12/2JOo69F8wh.png",
    play_count: 10_000, likes: 1_010, reposts: 80_000, comments: 2456,
  },
  {
    id: 3, title: "Don't waste my time",
    artists: [SUGGESTED_ARTISTS[1], SUGGESTED_ARTISTS[2]],
    cover: "https://static.codia.ai/image/2026-06-12/7njksXoWoj.png",
    play_count: 10_000, likes: 1_010, reposts: 80_000, comments: 2456,
  },
];

export default function Home() {
  return (
    <main className="flex-1 min-w-0">
      {LIKED_TRACKS ?
        <div>
          <h3>More of what you like</h3>
          <RowList>
            {LIKED_TRACKS.map(t => <MusicCard key={t.id} {...t} />)}
          </RowList>
        </div> : null}
      {RECENTLY_PLAYED ?
        <div>
          <h3>More of what you like</h3>
          <RowList>
            {RECENTLY_PLAYED.map(t => <MusicCard key={t.id} {...t} />)}
          </RowList>
        </div> : null}
    </main>
  );
}
