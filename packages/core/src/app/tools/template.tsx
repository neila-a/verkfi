"use client";
import {
    useContext,
    useEffect
} from "react";
import {
    useSearchParams,
    useSelectedLayoutSegment
} from "next/navigation";
import Recently from "components/Recently";
import {
    recentlyUsed as recentlyUsedContext,
    mostUsed as mostUsedContext
} from "layout/layoutClient";
// 每个3格最多显示
export default function Template(props: {
    children: React.ReactNode
}) {
    const gotThisTool = useSelectedLayoutSegment(),
        searchParams = useSearchParams(),
        recentlyUsed = useContext(recentlyUsedContext),
        mostUsedState = useContext(mostUsedContext),
        thisTool = gotThisTool === "extension" ? searchParams.get("tool") : gotThisTool;
    useEffect(() => {
        const set = new Recently(3, recentlyUsed.value.reverse());
        set.add(thisTool);
        const mostUsed = {
            ...mostUsedState.value
        };
        if (mostUsed.hasOwnProperty(thisTool)) {
            mostUsed[thisTool] = mostUsed[thisTool] + 1;
        } else {
            mostUsed[thisTool] = 0;
        }
        const tempRecently = set.get().reverse();
        if (JSON.stringify(tempRecently.sort()) !== JSON.stringify(recentlyUsed.value.sort())) {
            recentlyUsed.set(tempRecently.sort());
        }
        if (JSON.stringify(mostUsed) === JSON.stringify(mostUsedState.value)) {
            mostUsedState.set(mostUsed);
        }
    }, []); // 不放在副作用里会导致无限循环
    return (
        <>
            {props.children}
        </>
    );
}