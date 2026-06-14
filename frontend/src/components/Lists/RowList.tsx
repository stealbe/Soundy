'use client';

import React, { useEffect, useState, useRef } from "react";

export default function RowList({ children, prevCount = 3 }: { children: React.ReactNode; prevCount?: number; }) {
    const trackRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const [index, setIndex] = useState(0);
    const [visibleCount, setVisibleCount] = useState(prevCount);
    const [step, setStep] = useState(0);

    const GAP = 24;

    const total = React.Children.count(children);
    const maxIndex = Math.max(total - visibleCount, 0);
    const safeIndex = Math.min(index, maxIndex);

    const cardWidth = `calc((100% - ${(visibleCount - 1) * GAP}px) / ${visibleCount})`;

    useEffect(() => {
        const update = () => {
            const w = window.innerWidth;
            if (w <= 420) setVisibleCount(1);
            else if (w <= 640) setVisibleCount(2);
            else if (w <= 900) setVisibleCount(3);
            else if (w <= 1200) setVisibleCount(4);
            else setVisibleCount(prevCount);
        };
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, [prevCount]);

    useEffect(() => {
        const el = trackRef.current?.children[0] as HTMLElement;
        if (!el) return;
        const newStep = el.offsetWidth + GAP;
        if (newStep !== step) setStep(newStep);
    }, [total, visibleCount]);

    const next = () => setIndex(i => Math.min(i + 1, maxIndex));
    const prev = () => setIndex(i => Math.max(i - 1, 0));

    return (
        <div ref={containerRef} className="relative w-full" style={{ '--card-w': cardWidth } as React.CSSProperties}>

            {/* кнопка назад — поверх карточек слева */}
            {total > visibleCount && safeIndex > 0 && (
                <button
                    onClick={prev}
                    className="pt-[21px] pb-[21.5px] pl-[16.75px] pr-[21.5px] absolute left-2 top-[40%] -translate-y-1/2 z-10 p-3 rounded-full bg-black/70 text-white flex items-center justify-center"
                >
                    <svg className="rotate-180" width="33" height="29" viewBox="0 0 33 29" fill="none">
                        <path d="M30.4523 11.3274C32.8987 12.36 32.8963 15.8277 30.4484 16.8568L4.16249 27.9075C2.18444 28.7391 -0.00168224 27.2856 -0.000157705 25.1399L0.0155718 3.00102C0.0170964 0.855272 2.20528 -0.595132 4.18215 0.239263L30.4523 11.3274Z" fill="white" />
                    </svg>
                </button>
            )}

            {/* viewport — обрезает overflow */}
            <div className="overflow-hidden w-full">
                <div
                    ref={trackRef}
                    className="flex transition-transform duration-300 ease-out"
                    style={{
                        gap: `${GAP}px`,
                        transform: `translateX(-${safeIndex * step}px)`,
                    }}
                >
                    {React.Children.map(children, (child, i) => (
                        <div key={i} className="shrink-0 w-[var(--card-w)]">
                            {child}
                        </div>
                    ))}
                </div>
            </div>

            {/* кнопка вперёд — поверх карточек справа */}
            {total > visibleCount && (
                <button
                    onClick={next}
                    disabled={safeIndex === maxIndex}
                    className="pt-[21px] pb-[21.5px] pr-[16.75px] pl-[21.5px] absolute right-2 top-[40%] -translate-y-1/2 z-10 p-3 rounded-full bg-black/70 text-white disabled:opacity-0 flex items-center justify-center"
                >
                    <svg width="33" height="29" viewBox="0 0 33 29" fill="none">
                        <path d="M30.4523 11.3274C32.8987 12.36 32.8963 15.8277 30.4484 16.8568L4.16249 27.9075C2.18444 28.7391 -0.00168224 27.2856 -0.000157705 25.1399L0.0155718 3.00102C0.0170964 0.855272 2.20528 -0.595132 4.18215 0.239263L30.4523 11.3274Z" fill="white" />
                    </svg>
                </button>
            )}
        </div>
    );
}