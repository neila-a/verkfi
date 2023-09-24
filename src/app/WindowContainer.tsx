"use client";
import ErrorBoundary from "./components/ErrorBoundary";
import Window from "./components/window/Window";
import {
    windows
} from "./layoutClient";
import stringToBoolean from "./setting/stringToBoolean";
import checkOption from "./setting/checkOption";
import {
    useState
} from "react";
import getToolColor from "./tools/getToolColor";
import {
    getTools
} from "./tools/info";
import I18N from "react-intl-universal";
import {
    isBrowser
} from "./layoutClient";
import {
    useTheme
} from "@mui/material/styles";
import useStoragedState from "./components/useStoragedState";
export default function WindowContainer() {
    var [color, setColor] = useStoragedState("color", "多彩主页", "true");
    const toolsInfo = getTools(I18N),
        theme = useTheme();
    return (
        <ErrorBoundary>
            <windows.Consumer>
                {value => value.windows.map(single => (
                    <Window {...single} key={single.id} sx={{
                        background: stringToBoolean(color) ? getToolColor(toolsInfo, toolsInfo.filter(tool => tool.name === single.name)[0].to) : (theme.palette.mode === "dark" ? "#000000" : "#ffffff"),
                    }} />
                ))}
            </windows.Consumer>
        </ErrorBoundary>
    );
}