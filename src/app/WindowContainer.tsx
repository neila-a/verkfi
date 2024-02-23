"use client";
import ErrorBoundary from "./components/ErrorBoundary";
import dynamic from "next/dynamic";
const Window = dynamic(() => import("./components/window/Window"));
import {
    colorMode,
    windows as windowsContext
} from "./layout/layoutClient";
import stringToBoolean from "./setting/stringToBoolean";
import {
    useTheme
} from "@mui/material/styles";
import {
    useContext
} from "react";
export default function WindowContainer() {
    const colorContext = useContext(colorMode),
        windows = useContext(windowsContext).windows,
        color = colorContext.value,
        theme = useTheme();
    return (
        <ErrorBoundary>
            {windows.map(single => (
                <Window {...single} key={single.id} sx={{
                    background: stringToBoolean(color) ? `linear-gradient(45deg, #${single.color[0]}, #${single.color[1]})` : theme.palette.background.default,
                }} />
            ))}
        </ErrorBoundary>
    );
}