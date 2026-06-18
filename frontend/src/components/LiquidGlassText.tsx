"use client";

import React, {
    useId,
    useRef,
    useEffect,
    useState,
    CSSProperties,
} from "react";

export interface LiquidGlassTextProps {
    children: string;
    style?: CSSProperties;
    className?: string;
    /** Размер шрифта в px. По умолчанию 120 */
    fontSize?: number;
    /** Цвет стеклянной заливки (CSS color). По умолчанию "white" */
    glassColor?: string;
    /** Прозрачность стеклянной заливки (0–1). По умолчанию 0.18 */
    glassOpacity?: number;
    /** Интенсивность искажения фона (0–80). По умолчанию 30 */
    distortionScale?: number;
    /** Размытие внутри текста (px). По умолчанию 4 */
    blurAmount?: number;
}

/**
 * LiquidGlassText — liquid glass эффект на тексте с реальным искажением фона.
 *
 * Принцип работы:
 * 1. Находим ближайший positioned-предок с реальным фоном.
 * 2. Рисуем его фон (background-image / background-color) на offscreen canvas.
 * 3. Передаём data URL в SVG <feImage> → <feDisplacementMap> — получаем
 *    настоящее преломление пикселей фона внутри букв.
 *
 * Родитель ДОЛЖЕН иметь:
 *   - position: relative | absolute | fixed
 *   - background-image или background-color
 *
 * Пример:
 * ```tsx
 * <div style={{ position: "relative", backgroundImage: "url('/bg.jpg')",
 *               backgroundSize: "cover", padding: "60px 40px" }}>
 *   <LiquidGlassText fontSize={160} distortionScale={40}>Error 404</LiquidGlassText>
 * </div>
 * ```
 */
export const LiquidGlassText: React.FC<LiquidGlassTextProps> = ({
    children,
    style,
    className,
    fontSize = 120,
    glassColor = "white",
    glassOpacity = 0.18,
    distortionScale = 30,
    blurAmount = 4,
}) => {
    const uid = useId().replace(/:/g, "");
    const wrapRef = useRef<HTMLSpanElement>(null);

    // data URL снимка родительского фона
    const [bgDataUrl, setBgDataUrl] = useState<string | null>(null);
    // смещение компонента внутри родителя
    const [offset, setOffset] = useState({ x: 0, y: 0, pw: 0, ph: 0 });

    const W = fontSize * children.length * 0.60;
    const H = fontSize * 1.38;
    const tY = fontSize * 1.03;
    const font = `-apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif`;
    const filterId = `lgf-${uid}`;
    const clipId = `lgc-${uid}`;

    // ── Захват фона родителя ──────────────────────────────────────────────────
    useEffect(() => {
        const el = wrapRef.current;
        if (!el || distortionScale === 0) {
            setBgDataUrl(null);
            return;
        }

        const capture = () => {
            // Ищем positioned-предка
            let parent = el.offsetParent as HTMLElement | null;
            if (!parent || parent === document.body) parent = el.parentElement;
            if (!parent) return;

            const pRect = parent.getBoundingClientRect();
            const eRect = el.getBoundingClientRect();

            const pw = pRect.width;
            const ph = pRect.height;
            setOffset({
                x: eRect.left - pRect.left,
                y: eRect.top - pRect.top,
                pw, ph,
            });

            // Рисуем фон родителя на offscreen canvas
            const canvas = document.createElement("canvas");
            canvas.width = pw;
            canvas.height = ph;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            const cs = window.getComputedStyle(parent);
            const bgColor = cs.backgroundColor;
            const bgImage = cs.backgroundImage;
            const bgSize = cs.backgroundSize;
            const bgPos = cs.backgroundPosition;

            // 1. Заливка цветом фона
            ctx.fillStyle = bgColor !== "rgba(0, 0, 0, 0)" ? bgColor : "#888";
            ctx.fillRect(0, 0, pw, ph);

            // 2. Если есть background-image — загружаем и рисуем
            const urlMatch = bgImage.match(/url\(["']?([^"')]+)["']?\)/);
            if (urlMatch) {
                const img = new Image();
                img.crossOrigin = "anonymous";
                img.onload = () => {
                    // Имитируем background-size: cover
                    const scale = Math.max(pw / img.naturalWidth, ph / img.naturalHeight);
                    const dw = img.naturalWidth * scale;
                    const dh = img.naturalHeight * scale;
                    const dx = (pw - dw) / 2;
                    const dy = (ph - dh) / 2;
                    ctx.drawImage(img, dx, dy, dw, dh);
                    setBgDataUrl(canvas.toDataURL("image/png"));
                };
                img.onerror = () => {
                    // Картинка не загрузилась (CORS и т.д.) — всё равно сохраняем цвет
                    setBgDataUrl(canvas.toDataURL("image/png"));
                };
                img.src = urlMatch[1];
            } else {
                setBgDataUrl(canvas.toDataURL("image/png"));
            }
        };

        capture();

        const ro = new ResizeObserver(capture);
        ro.observe(el);
        return () => ro.disconnect();
    }, [children, fontSize, distortionScale]);

    // SVG-маска для backdrop-filter слоя
    const maskSvgStr = encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' width='${W}' height='${H}'>` +
        `<text x='${W / 2}' y='${tY}' text-anchor='middle' ` +
        `font-family='-apple-system,BlinkMacSystemFont,Helvetica Neue,Arial,sans-serif' ` +
        `font-size='${fontSize}' font-weight='300' letter-spacing='-2' ` +
        `fill='white'>${children}</text></svg>`
    );

    function hexOrNameToRgb(color: string) {
        // Для передачи в stop-color просто возвращаем как есть
        return color;
    }

    const { x: offX, y: offY, pw: bgW, ph: bgH } = offset;

    return (
        <span
            ref={wrapRef}
            className={className}
            style={{
                display: "inline-block",
                position: "relative",
                lineHeight: 0,
                ...style,
            }}
        >
            {/* ── Backdrop blur (fallback когда нет bgDataUrl) ── */}
            <div
                aria-hidden="true"
                style={{
                    position: "absolute",
                    inset: 0,
                    backdropFilter: `blur(${blurAmount}px) brightness(1.08) saturate(1.12)`,
                    WebkitBackdropFilter: `blur(${blurAmount}px) brightness(1.08) saturate(1.12)`,
                    maskImage: `url("data:image/svg+xml,${maskSvgStr}")`,
                    maskSize: "100% 100%",
                    WebkitMaskImage: `url("data:image/svg+xml,${maskSvgStr}")`,
                    WebkitMaskSize: "100% 100%",
                }}
            />

            {/* ── SVG: реальная дисторсия + градиенты + блики ── */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox={`0 0 ${W} ${H}`}
                width={W}
                height={H}
                style={{ display: "block", overflow: "visible", position: "relative" }}
                aria-label={children}
            >
                <defs>
                    {/* Фильтр с реальным фоном — только когда snapshot готов */}
                    {bgDataUrl && (
                        <filter
                            id={filterId}
                            x="0" y="0"
                            width={`${W}px`} height={`${H}px`}
                            filterUnits="userSpaceOnUse"
                            colorInterpolationFilters="sRGB"
                        >
                            {/* Снимок родительского фона, сдвинутый так чтобы
                  под буквами оказался правильный кусок */}
                            <feImage
                                href={bgDataUrl}
                                x={-offX} y={-offY}
                                width={bgW} height={bgH}
                                preserveAspectRatio="xMinYMin slice"
                                result="bg"
                            />
                            <feTurbulence
                                type="fractalNoise"
                                baseFrequency="0.018 0.024"
                                numOctaves="3"
                                seed="12"
                                result="noise"
                            />
                            <feDisplacementMap
                                in="bg"
                                in2="noise"
                                scale={distortionScale}
                                xChannelSelector="R"
                                yChannelSelector="G"
                                result="displaced"
                            />
                            {blurAmount > 0 && (
                                <feGaussianBlur
                                    in="displaced"
                                    stdDeviation={blurAmount * 0.4}
                                />
                            )}
                        </filter>
                    )}

                    {/* Clip по форме текста */}
                    <clipPath id={clipId}>
                        <text
                            x={W / 2} y={tY}
                            textAnchor="middle"
                            fontFamily={font}
                            fontSize={fontSize}
                            fontWeight="300"
                            letterSpacing="-2"
                        >
                            {children}
                        </text>
                    </clipPath>

                    <linearGradient id={`gf-${uid}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={glassColor} stopOpacity={Math.min(1, glassOpacity + 0.10)} />
                        <stop offset="50%" stopColor={glassColor} stopOpacity={glassOpacity} />
                        <stop offset="100%" stopColor={glassColor} stopOpacity={glassOpacity * 0.25} />
                    </linearGradient>

                    <linearGradient id={`gh-${uid}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="white" stopOpacity="0.82" />
                        <stop offset="100%" stopColor="white" stopOpacity="0" />
                    </linearGradient>

                    <linearGradient id={`gr-${uid}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="white" stopOpacity="0" />
                        <stop offset="65%" stopColor="white" stopOpacity="0.06" />
                        <stop offset="100%" stopColor="white" stopOpacity="0.20" />
                    </linearGradient>

                    <radialGradient id={`gc-${uid}`} cx="50%" cy="8%" r="65%" fx="50%" fy="3%">
                        <stop offset="0%" stopColor="white" stopOpacity="0.38" />
                        <stop offset="100%" stopColor="white" stopOpacity="0" />
                    </radialGradient>
                </defs>

                <g clipPath={`url(#${clipId})`}>
                    {/* Искажённый фон через feImage → feDisplacementMap */}
                    {bgDataUrl && (
                        <rect
                            x={0} y={0} width={W} height={H}
                            fill="transparent"
                            filter={`url(#${filterId})`}
                        />
                    )}

                    <rect x={0} y={0} width={W} height={H} fill={`url(#gf-${uid})`} />
                    <rect x={0} y={0} width={W} height={H} fill={`url(#gc-${uid})`} />
                    <rect
                        x={W * 0.04} y={fontSize * 0.07}
                        width={W * 0.92} height={fontSize * 0.22}
                        rx={fontSize * 0.04}
                        fill={`url(#gh-${uid})`}
                    />
                    <rect x={0} y={H * 0.52} width={W} height={H * 0.48} fill={`url(#gr-${uid})`} />
                </g>

                {/* Белая обводка — верхний блик кромки */}
                <text
                    x={W / 2} y={tY} textAnchor="middle"
                    fontFamily={font} fontSize={fontSize} fontWeight="300" letterSpacing="-2"
                    fill="none" stroke="rgba(255,255,255,0.62)" strokeWidth="1.5"
                    strokeLinejoin="round" style={{ paintOrder: "stroke fill" }}
                >
                    {children}
                </text>

                {/* Тёмная обводка — тень снизу */}
                <text
                    x={W / 2} y={tY + 1.5} textAnchor="middle"
                    fontFamily={font} fontSize={fontSize} fontWeight="300" letterSpacing="-2"
                    fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="1"
                >
                    {children}
                </text>
            </svg>
        </span>
    );
};

export default LiquidGlassText;