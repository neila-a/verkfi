"use client";
import {
    useEffect
} from "react";
import checkOption from "../setting/checkOption";
import {
    useSelectedLayoutSegment
} from "next/navigation";
import setSetting from "../setting/setSetting";
import Recently from "../components/Recently";
// 每个3格最多显示
export default function Template(props: {
    children: React.ReactNode
}) {
    const thisTool = useSelectedLayoutSegment();
    useEffect(() => {
        const set = new Recently(3, (JSON.parse(checkOption<string>("recently-tools", "最近使用的工具", "[]")) as string[]).reverse());
        set.add(thisTool);
        setSetting("recently-tools", "最近使用的工具", JSON.stringify(set.get().reverse()));
        const mostUsed = JSON.parse(checkOption<string>("most-tools", "最常使用的工具", "{}"));
        if (mostUsed.hasOwnProperty(thisTool)) {
            mostUsed[thisTool] = mostUsed[thisTool] + 1;
        } else {
            mostUsed[thisTool] = 0;
        }
        setSetting("most-tools", "最常使用的工具", JSON.stringify(mostUsed));
    }, []);
    return (
        <>
            {props.children}
        </>
    );
}