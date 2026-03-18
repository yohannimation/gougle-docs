import { useState, useEffect, useRef, useCallback } from 'react';

import type { FeatureInterface } from '@/interface/Feature.interface';

interface SliderProps {
    items?: FeatureInterface[];
}

interface HighlightStyle {
    left: number;
    width: number;
}

export default function Slider({ items = [] }: SliderProps) {
    const [displayed, setDisplayed] = useState<number>(0);
    const [fading, setFading] = useState<boolean>(false);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [progressKey, setProgressKey] = useState<number>(0);
    const currentRef = useRef<number>(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
    const [highlightStyle, setHighlightStyle] = useState<HighlightStyle>({
        left: 0,
        width: 0,
    });

    const moveHighlight = useCallback((index) => {
        const tab = tabsRef.current[index];
        if (!tab) return;
        setHighlightStyle({ left: tab.offsetLeft, width: tab.offsetWidth });
    }, []);

    const goTo = useCallback(
        (index) => {
            setFading(true);
            moveHighlight(index);
            setTimeout(() => {
                currentRef.current = index;
                setDisplayed(index);
                setProgressKey((k) => k + 1);
                setFading(false);
            }, 200);
        },
        [moveHighlight]
    );

    const startTimer = useCallback(() => {
        clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            goTo((currentRef.current + 1) % items.length);
        }, 5000);
    }, [goTo, items.length]);

    useEffect(() => {
        moveHighlight(0);
        startTimer();
        return () => clearInterval(timerRef.current);
    }, [startTimer, moveHighlight]);

    const handleMouseEnter = (index) => {
        setHoveredIndex(index);
        clearInterval(timerRef.current);
        moveHighlight(index);
        goTo(index);
    };

    const handleMouseLeave = () => {
        setHoveredIndex(null);
        startTimer();
    };

    const item = items[displayed];

    return (
        <div className="flex flex-col gap-3">
            {/* Tabs */}
            <div className="p-2 flex gap-1.5 sm:flex-wrap bg-blue-50 border border-blue-200 rounded-3xl shadow-lg">
                <div className="relative flex w-full items-stretch border border-blue-200 bg-white rounded-xl overflow-hidden group">
                    {/* Sliding background */}
                    <div
                        className="absolute bottom-0 h-full bg-blue-200 group-hover:bg-blue-500 pointer-events-none transition-all duration-200 ease-in-out"
                        style={{
                            left: highlightStyle.left,
                            width: highlightStyle.width,
                        }}
                    />

                    {items.map((item, index) => (
                        <button
                            key={index}
                            ref={(el) => void (tabsRef.current[index] = el)}
                            onMouseEnter={() => handleMouseEnter(index)}
                            onMouseLeave={handleMouseLeave}
                            className={`relative flex-1 py-2 px-4 text-center transition-colors font-semibold duration-200 z-10 ${
                                index === displayed
                                    ? 'text-blue-500 hover:text-white'
                                    : 'text-black hover:text-white'
                            }`}
                        >
                            {item.name}

                            {/* Progress bar */}
                            {index === displayed && hoveredIndex === null && (
                                <span
                                    key={progressKey}
                                    className="absolute bottom-0 left-0 h-[2px] bg-blue-500"
                                    style={{
                                        animation:
                                            'tabProgress 5s linear forwards',
                                    }}
                                />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="border border-blue-200 rounded-3xl bg-white shadow-lg">
                <div
                    className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 items-start gap-5 transition-opacity duration-200 ${
                        fading ? 'opacity-0' : 'opacity-100'
                    }`}
                >
                    <div className="m-2 mb-0 md:mb-2 md:me-0 aspect-[16/9] rounded-xl overflow-hidden bg-gray-100">
                        {/* <img
                            src={item.sourceUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                        /> */}
                    </div>

                    <div className="flex flex-col p-3 pt-0 md:pt-4 xl:col-span-2">
                        <span className="text-muted-foreground text-xs uppercase">
                            {String(displayed + 1).padStart(2, '0')} /{' '}
                            {String(items.length).padStart(2, '0')}
                        </span>
                        <h3 className="mb-2">{item.name}</h3>
                        <p className="text-muted-foreground">
                            {item.description}
                        </p>
                    </div>
                </div>
            </div>

            <style>
                {`
                    @keyframes tabProgress {
                        from { width: 0% }
                        to   { width: 100% }
                    }
                `}
            </style>
        </div>
    );
}
