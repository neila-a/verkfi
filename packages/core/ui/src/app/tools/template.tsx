"use client";
import Recently from "@verkfi/shared/Recently";
import {
    useAtom
} from "jotai";
import {
    mostUsedAtom as mostUsedAtom,
    mostUsedSelects,
    recentlyUsedAtom as recentlyUsedAtom
} from "@verkfi/shared/atoms";
import {
    useSearchParams,
    useSelectedLayoutSegment
} from "next/navigation";
import {
    ReactNode,
    startTransition,
    useEffect
} from "react";
// 每个3格最多显示
export default function Template(props: {
    children: ReactNode;
}) {
    const gotThisTool = useSelectedLayoutSegment(),
        searchParams = useSearchParams(),
        [recentlyUsed, setRecentlyUsed] = useAtom(recentlyUsedAtom),
        [mostUsedState, setMostUsed] = useAtom(mostUsedAtom),
        thisTool = gotThisTool === "extension" ? searchParams.get("tool") : gotThisTool;
    useEffect(() => {
        if (!searchParams.has("only")) {
            const set = new Recently(mostUsedSelects, recentlyUsed.reverse());
            set.add(thisTool);
            const mostUsed = {
                ...mostUsedState
            };
            if (mostUsed.hasOwnProperty(thisTool)) {
                mostUsed[thisTool] = mostUsed[thisTool] + 1;
            } else {
                mostUsed[thisTool] = 0;
            }
            const tempRecently = set.get().reverse();
            if (JSON.stringify(tempRecently.sort()) !== JSON.stringify(recentlyUsed.sort())) {
                startTransition(() => setRecentlyUsed(tempRecently.sort()));
            }
            if (JSON.stringify(mostUsed) === JSON.stringify(mostUsedState)) {
                startTransition(() => setMostUsed(mostUsed));
            }
        }
        // 这东西只要进入的时候记一次就可以了
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // 不放在副作用里会导致无限循环
    return props.children;
}
