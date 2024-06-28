"use client";
import {
    Box
} from "@mui/material";
import HeadBar from "@verkfi/shared/HeadBar";
import {
    useAtomValue
} from "jotai";
import {
    convertedExtensionsAtom
} from "@verkfi/shared/atoms/extensions";
import {
    gradientToolAtom
} from "@verkfi/shared/atoms";
import Loading from "loading";
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
export default function ToolFinder(props: {
    children: ReactNode;
}) {
    const color = useAtomValue(gradientToolAtom),
        segment = useSelectedLayoutSegment(),
        searchParams = useSearchParams(),
        toolID = segment === "extension" ? searchParams.get("tool") : segment,
        converted = useAtomValue(convertedExtensionsAtom),
        only = searchParams.has("only"),
        internalToolsInfo = useAtomValue(toolsInfoAtom),
        toolsInfo = segment === "extension" ? converted.map(single => ({
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
