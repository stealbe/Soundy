import Header from "../components/Header";
import HeroSubBanner from "../components/HeroSubBanner";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <main>
        <Header user={null} />
        <HeroSubBanner />
      </main>
    </div>
  );
}