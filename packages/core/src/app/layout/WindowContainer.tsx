"use client";
import ErrorBoundary from "components/ErrorBoundary";
import dynamic from "next/dynamic";
const Window = dynamic(() => import("components/window/Window"));
import {
    gradientTool,
    windows as windowsContext
} from "layout/layoutClient";
import {
    useContext
} from "react";
export default function WindowContainer() {
    const colorContext = useContext(gradientTool),
        {
            windows
        } = useContext(windowsContext),
        color = colorContext.value;
    return (
        <ErrorBoundary>
            {windows.map(single => (
                <Window {...single} key={single.id} sx={{
                    backgroundImage: color && `linear-gradient(45deg, #${single.color[0]}, #${single.color[1]})`,
                    backgroundColor: !color && `#${single.color[0]}`,
                }} />
            ))}
        </ErrorBoundary>
    );
}