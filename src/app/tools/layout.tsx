"use client";
import {
    useRouter,
    useSearchParams,
    useSelectedLayoutSegment
} from "next/navigation";
import {
    ReactNode,
    useContext
} from "react";
import HeadBar from "../components/HeadBar";
import {
    getTools
} from "./info";
import {
    Box
} from "@mui/material";
import {
    get
} from "react-intl-universal";
import lpLogger from "lp-logger";
import stringToBoolean from "../setting/stringToBoolean";
import getToolColor from "./getToolColor";
import {
    colorMode
} from "../layout/layoutClient";
import {
    useLiveQuery
} from "dexie-react-hooks";
import db from "./extension/db";
import convertExtensionTools from "../index/convertExtensionTools";
import {
    emptyExtension
} from "./extension/empties";
var logger = new lpLogger({
    name: "ToolFinder",
    level: "log"
});
export default function ToolFinder(props: {
    children: ReactNode;
}): JSX.Element {
    const colorContext = useContext(colorMode),
        color = colorContext.value,
        segment = useSelectedLayoutSegment(),
        searchParams = useSearchParams(),
        toolID = segment === "extension" ? searchParams.get("tool") : segment,
        extensionTools = useLiveQuery(() => db.extensionTools.toArray(), [], []),
        only = searchParams.has("only"),
        toolsInfo = segment === "extension" ? convertExtensionTools(extensionTools).map(single => ({
            ...single,
            to: single.to.replace("/tools/extension?tool=", "") as Lowercase<string>
        })) : getTools(get),
        filteredToolsInfo = toolsInfo.filter(si => si.to === toolID),
        {
            name
        } = filteredToolsInfo.length === 0 ? emptyExtension : filteredToolsInfo[0];
    logger.info(`toolID为${toolID}`);
    return (
        <>
            <HeadBar isIndex={false} pageName={name === "" ? get("未找到工具") : name} only={only} sx={{
                backgroundImage: stringToBoolean(color) && getToolColor(toolsInfo, toolID)
            }} />
            <Box sx={{
                p: 3
            }} component="article" id="container">
                {props.children}
            </Box>
            <Box component="section" id="outside" />
        </>
    );
}
