import SideNav from "@/components/SideNav";
import HeroSubBanner from "@/components/HeroSubBanner";

export default function mainLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <HeroSubBanner />
            <div className="flex w-full items-start pr-25">
                {children}
                <SideNav />
            </div>
        </>
    )
}