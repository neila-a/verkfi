"use client";
import {
    useSearchParams,
    useSelectedLayoutSegment
} from "next/navigation";
import {
    ReactNode,
    Suspense,
    useContext
} from "react";
import HeadBar from "components/HeadBar";
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
import getToolColor from "./getToolColor";
import {
    colorMode,
    extensions
} from "layout/layoutClient";
import {
    useLiveQuery
} from "dexie-react-hooks";
import db from "db";
import convertExtensionTools from "index/convertExtensionTools";
import {
    emptyExtension
} from "./extension/empties";
import Loading from "loading";
const logger = new lpLogger({
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
        extensionTools = useContext(extensions).value,
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
                backgroundImage: color && getToolColor(toolsInfo, toolID)
            }} />
            <Box sx={{
                p: 3
            }} component="article" id="container">
                <Suspense fallback={<Loading />}>
                    {props.children}
                </Suspense>
            </Box>
            <Box component="section" id="outside" />
        </>
    );
}