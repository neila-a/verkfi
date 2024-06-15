"use client";
import {
    Box
} from "@mui/material";
import HeadBar from "@verkfi/shared/HeadBar";
import convertExtensionTools from "index/convertExtensionTools";
import {
    useAtom
} from "jotai";
import extensionsAtom from "@verkfi/shared/atoms/extensions";
import {
    gradientTool
} from "@verkfi/shared/atoms";
import Loading from "loading";
import lpLogger from "lp-logger";
import {
    useSearchParams,
    useSelectedLayoutSegment
} from "next/navigation";
import {
    ReactNode,
    Suspense
} from "react";
import {
    get
} from "react-intl-universal";
import {
    emptyNXTMetadata
} from "tools/extension/empties";
import toolsInfoAtom from "./info";
const logger = new lpLogger({
    name: "ToolFinder",
    level: "log"
});
export default function ToolFinder(props: {
    children: ReactNode;
}): JSX.Element {
    const [color] = useAtom(gradientTool),
        segment = useSelectedLayoutSegment(),
        searchParams = useSearchParams(),
        toolID = segment === "extension" ? searchParams.get("tool") : segment,
        [extensionTools] = useAtom(extensionsAtom),
        only = searchParams.has("only"),
        [internalToolsInfo] = useAtom(toolsInfoAtom),
        toolsInfo = segment === "extension" ? convertExtensionTools(extensionTools).map(single => ({
            ...single,
            to: single.to.replace("/tools/extension?tool=", "") as Lowercase<string>
        })) : internalToolsInfo,
        filteredToolsInfo = toolsInfo.filter(si => si.to === toolID),
        {
            name
        } = filteredToolsInfo.length === 0 ? emptyNXTMetadata : filteredToolsInfo[0],
        tool = toolsInfo.find(si => si.to === toolID);
    return (
        <>
            <HeadBar isIndex={false} pageName={name === "" ? get("未找到工具") : name} only={only} sx={tool !== undefined && {
                backgroundImage: color && `linear-gradient(45deg, #${tool.color[0]}, #${tool.color[1]})`,
                backgroundColor: !color && `#${tool.color[0]}`
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
