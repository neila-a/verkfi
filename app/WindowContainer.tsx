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
import getToolColor from "./tool/getToolColor";
import {
    getTools
} from "./tools/info";
import I18N from "react-intl-universal";
export default function WindowContainer() {
    var [color, setColor] = useState<boolean>(() => {
        const mode = stringToBoolean(checkOption("color", "多彩主页", "true"));
        return mode || true;
    });
    const toolsInfo = getTools(I18N);
    return (
        <ErrorBoundary>
            <windows.Consumer>
                {value => value.windows.map(single => (
                    <Window {...single} key={single.id} sx={{
                        backgroundImage: color ? getToolColor(toolsInfo, toolsInfo.filter(tool => tool.name === single.name)[0].to) : "",
                    }} />
                ))}
            </windows.Consumer>
        </ErrorBoundary>
    );
}