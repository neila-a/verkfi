import {
    useRouter
} from "next/router";
import React, { Fragment } from "react";
import HeadBar from "../components/HeadBar";
import {
    realTools as toolsInfo
} from ".";
import {
    Box, Toolbar
} from "@mui/material";
import {
    components as tools
} from "../components/tools";
import lpLogger from "lp-logger";
import zIndex from "@mui/material/styles/zIndex";
var logger = new lpLogger({
    name: "ToolFinder",
    level: "log"
});
export type tJSXE = () => JSX.Element;
export default function ToolFinder(): JSX.Element {
    var router = useRouter(),
        only = false,
        toolID: string,
        Tool: tJSXE;
    const finder = (id: string) => {
        logger.info(`toolID为${id}`);
        toolsInfo.forEach(si => {
            if (((tools[si.to] as tJSXE) != undefined) && (si.to == id) && si.goto == undefined) {
                Tool = tools[si.to];
                logger.info("<Tool />为", Tool);
            }
        });
    }
    if (router.query.tool) {
        logger.info("query的内容为", router.query);
        let id = router.query.tool as string;
        toolID = id;
        finder(id)
    }
    if (router.query.handle) {
        logger.info("query的内容为", router.query);
        let id = (router.query.handle as string).replace(/web\+neilatools:\/\//g, "");
        toolID = id;
        finder(id);
    }
    if (router.query.only == "true") {
        only = true;
    }
    return (
        <>
            <HeadBar isIndex={false} pageName={(() => {
                var name: string;
                toolsInfo.forEach(si => {
                    if (si.to == toolID) name = si.name;
                });
                if (name == "") return "未找到工具"
                return name;
            })()} only={only} />
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