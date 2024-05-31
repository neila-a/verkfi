"use client";
import ErrorBoundary from "@verkfi/shared/ErrorBoundary";
import {
    useAtom
} from "jotai";
import {
    gradientTool,
    windows as windowsAtom
} from "@verkfi/shared/atoms";
import dynamic from "next/dynamic";
const Window = dynamic(() => import("@verkfi/shared/window/Window"));
export default function WindowContainer() {
    const [color] = useAtom(gradientTool),
        [windows] = useAtom(windowsAtom);
    return (
        <ErrorBoundary>
            {windows.map(single => (
                <Window {...single} key={single.id} sx={{
                    backgroundImage: color && `linear-gradient(45deg, #${single.color[0]}, #${single.color[1]})`,
                    backgroundColor: !color && `#${single.color[0]}`
                }} />
            ))}
        </ErrorBoundary>
    );
}
