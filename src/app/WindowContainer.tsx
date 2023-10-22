"use client";
import ErrorBoundary from "./components/ErrorBoundary";
import Window from "./components/window/Window";
import {
    colorMode,
    windows
} from "./layoutClient";
import stringToBoolean from "./setting/stringToBoolean";
import {
    useTheme
} from "@mui/material/styles";
import {
    useContext
} from "react";
export default function WindowContainer() {
    var colorContext = useContext(colorMode),
        color = colorContext.value;
    const theme = useTheme();
    return (
        <ErrorBoundary>
            <windows.Consumer>
                {value => value.windows.map(single => (
                    <Window {...single} key={single.id} sx={{
                        background: stringToBoolean(color) ? `linear-gradient(45deg, #${single.color[0]}, #${single.color[1]})` : theme.palette.background.default,
                    }} />
                ))}
            </windows.Consumer>
        </ErrorBoundary>
    );
}