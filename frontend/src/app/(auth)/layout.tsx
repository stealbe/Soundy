import "./layout.css";
export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className="flex w-full items-start pr-25">
                {children}
            </div>
        </>
    );
}