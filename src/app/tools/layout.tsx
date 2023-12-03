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
import HeadBar from "../components/headBar/HeadBar";
import {
    getTools
} from "./info";
import {
    Box
} from "@mui/material";
import intl, {
    get
} from "react-intl-universal";
import lpLogger from "lp-logger";
import stringToBoolean from "../setting/stringToBoolean";
import getToolColor from "./getToolColor";
import {
    colorMode
} from "../layout/layoutClient";
var logger = new lpLogger({
    name: "ToolFinder",
    level: "log"
});
export default function ToolFinder(props: {
    children: ReactNode;
}): JSX.Element {
    var only = false,
        toolsInfo = getTools(get),
        colorContext = useContext(colorMode),
        color = colorContext.value;
    const toolID = useSelectedLayoutSegment(),
        searchParams = useSearchParams(),
        router = useRouter();
    logger.info(`toolID为${toolID}`);
    if (searchParams.has("handle")) {
        let id = searchParams.get("handle").replace(/web\+verkfi:\/\//g, "");
        router.push(id);
    }
    if (searchParams.has("only")) {
        only = true;
    }
    const toolColor = stringToBoolean(color) ? getToolColor(toolsInfo, toolID) : "";
    return (
        <>
            <HeadBar isIndex={false} pageName={(() => {
                var name: string;
                toolsInfo.forEach(si => {
                    if (si.to == toolID) name = si.name;
                });
                if (name == "") return get("未找到工具");
                return name;
            })()} only={only} sx={{
                backgroundImage: toolColor
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
