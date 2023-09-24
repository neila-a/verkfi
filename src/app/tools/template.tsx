"use client";
import {
    useEffect
} from "react";
import checkOption from "../setting/checkOption";
import {
    useSelectedLayoutSegment
} from "next/navigation";
import setSetting from "../setting/setSetting";
// 每个3格最多显示
export default function Template(props: {
    children: React.ReactNode
}) {
    const thisTool = useSelectedLayoutSegment();
    useEffect(() => {
        var recentlyUsed: string[] = JSON.parse(checkOption<string>("recently-tools", "最近使用的工具", "[]"));
        console.log(recentlyUsed)
        if (recentlyUsed.length === 0) {
            recentlyUsed = [thisTool];
        } else if (recentlyUsed.length === 1) {
            if (recentlyUsed[0] !== thisTool) {
                recentlyUsed[1] = recentlyUsed[0];
                recentlyUsed[0] = thisTool;
            }
        } else if (recentlyUsed.length === 2) {
            if (recentlyUsed.includes(thisTool)) {
                recentlyUsed[1] = recentlyUsed[0];
                recentlyUsed[0] = thisTool;
            } else if (recentlyUsed.indexOf(thisTool) !== 0) {
                recentlyUsed[2] = recentlyUsed[1];
                recentlyUsed[1] = recentlyUsed[0];
                recentlyUsed[0] = thisTool;
            }
        } else if (recentlyUsed.length === 3) {
            if (recentlyUsed.indexOf(thisTool) === 2 || recentlyUsed.indexOf(thisTool) === -1) {
                recentlyUsed[2] = recentlyUsed[1];
                recentlyUsed[1] = recentlyUsed[0];
                recentlyUsed[0] = thisTool;
            } else if (recentlyUsed.indexOf(thisTool) !== 0) {
                recentlyUsed[1] = recentlyUsed[0];
                recentlyUsed[0] = thisTool;
            }
        }
        setSetting("recently-tools", "最近使用的工具", JSON.stringify(recentlyUsed));
    }, []);
    return (
        <>
            {props.children}
        </>
    );
}