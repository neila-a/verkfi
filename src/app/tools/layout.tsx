"use client";
import {
    useRouter,
    useSearchParams,
    useSelectedLayoutSegment
} from "next/navigation";
import {
    ReactNode,
    useState,
    useContext,
    useEffect
} from "react";
import {
    getTools
} from "./info";
import {
    Box,
    Toolbar
} from "@mui/material";
import I18N from "react-intl-universal";
import lpLogger from "lp-logger";
import stringToBoolean from "../setting/stringToBoolean";
import checkOption from "../setting/checkOption";
import getToolColor from "./getToolColor";
import {
    Metadata,
    isBrowser
} from "../layoutClient";
var logger = new lpLogger({
    name: "ToolFinder",
    level: "log"
});
export default function ToolFinder(props: {
    children: ReactNode;
}): JSX.Element {
    var only = false,
        toolsInfo = getTools(I18N),
        [color, setColor] = useState<boolean>(() => {
            const mode = stringToBoolean(checkOption("color", "多彩主页", "true"));
            if (isBrowser()) {
                return mode;
            }
            return true;
        });
    const toolID = useSelectedLayoutSegment(),
        searchParams = useSearchParams(),
        router = useRouter();
    logger.info(`toolID为${toolID}`);
    if (searchParams.has("handle")) {
        let id = searchParams.get("handle").replace(/web\+neilatools:\/\//g, "");
        router.push(id);
    }
    if (searchParams.has("only")) {
        only = true;
    }
    const toolColor = color ? getToolColor(toolsInfo, toolID) : "";
    const metaData = useContext(Metadata);
    useEffect(() => {
        metaData.set({
            pageName: (() => {
                var name: string;
                toolsInfo.forEach(si => {
                    if (si.to == toolID) name = si.name;
                });
                if (name == "") return I18N.get("未找到工具");
                return name;
            })(),
            only,
            sx: {
                backgroundImage: toolColor,
                color: color ? "#000000" : ""
            }
        });
    }, []);
    return (
        <>
            {!only && <Toolbar />}
            <Box sx={{
                p: 3,
                zIndex: 38602
            }} id="container">
                {props.children}
            </Box>
            <div id="outside" />
        </>
    );
}
