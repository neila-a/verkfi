"use client";
import {
    useContext,
    useEffect
} from "react";
import {
    useSelectedLayoutSegment
} from "next/navigation";
import Recently from "../components/Recently";
import {
    recentlyUsed as recentlyUsedContext,
    mostUsed as mostUsedContext
} from "../layout/layoutClient";
// 每个3格最多显示
export default function Template(props: {
    children: React.ReactNode
}) {
    const thisTool = useSelectedLayoutSegment(),
        recentlyUsed = useContext(recentlyUsedContext),
        mostUsedState = useContext(mostUsedContext);
    useEffect(() => {
        const set = new Recently(3, (JSON.parse(recentlyUsed.value) as string[]).reverse());
        set.add(thisTool);
        const mostUsed = JSON.parse(mostUsedState.value);
        if (mostUsed.hasOwnProperty(thisTool)) {
            mostUsed[thisTool] = mostUsed[thisTool] + 1;
        } else {
            mostUsed[thisTool] = 0;
        }
        recentlyUsed.set(JSON.stringify(set.get().reverse()));
        mostUsedState.set(JSON.stringify(mostUsed));
    }, []); // 不放在副作用里会导致无限循环
    return (
        <>
            {props.children}
        </>
    );
}