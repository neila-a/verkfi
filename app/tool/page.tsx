"use client";
import {
    useRouter,
    useSearchParams
} from "next/navigation";
import {
    FC,
    useState
} from "react";
import HeadBar from "../components/headBar/HeadBar";
import {
    getTools
} from "../tools/info";
import {
    Box,
    Toolbar
} from "@mui/material";
import I18N from "react-intl-universal";
import {
    components as tools
} from "../tools/components"
import lpLogger from "lp-logger";
import stringToBoolean from "../setting/stringToBoolean";
import checkOption from "../setting/checkOption";
import getToolColor from "./getToolColor";
var logger = new lpLogger({
    name: "ToolFinder",
    level: "log"
});
export default function ToolFinder(): JSX.Element {
    var only = false,
        toolID: string,
        Tool: FC,
        toolsInfo = getTools(I18N),
        [color, setColor] = useState<boolean>(() => {
            const mode = stringToBoolean(checkOption("color", "多彩主页", "true"));
            return mode || true;
        });
    const finder = (id: string) => {
        logger.info(`toolID为${id}`);
        toolsInfo.forEach(si => {
            if (((tools[si.to] as FC) != undefined) && (si.to == id) && !si.isGoto) {
                Tool = tools[si.to];
                logger.info("<Tool />为", Tool);
            }
        });
    },
        searchParams = useSearchParams(),
        router = useRouter();
    if (searchParams.has("tool")) {
        let id = searchParams.get("tool");
        toolID = id;
        finder(id);
    }
    if (searchParams.has("handle")) {
        let id = searchParams.get("handle").replace(/web\+neilatools:\/\//g, "");
        router.push(id);
    }
    if (searchParams.has("only")) {
        only = true;
    }
    const toolColor = color ? getToolColor(toolsInfo, toolID) : "";
    return (
        <>
            <HeadBar isIndex={false} pageName={(() => {
                var name: string;
                toolsInfo.forEach(si => {
                    if (si.to == toolID) name = si.name;
                });
                if (name == "") return I18N.get("未找到工具");
                return name;
            })()} only={only} sx={{
                backgroundImage: toolColor,
                color: color ? "#000000" : ""
            }} />
            <Toolbar />
            <Box sx={{
                p: 3,
                zIndex: 38602
            }} id="container">
                {toolID != undefined && <Tool />}
            </Box>
            <div id="outside" />
        </>
    );
}
