import {
    useRouter
} from "next/router";
import React, { Fragment } from "react";
import HeadBar from "../components/HeadBar";
import {
    realTools as toolsInfo
} from ".";
import {
    Typography
} from "@mui/material";
import {
    components as tools
} from "../components/tools";
import lpLogger from "lp-logger";
export var logger = new lpLogger({
    name: "ToolFinder",
    level: "log"
}); 
export type tJSXE = () => JSX.Element;
export default function ToolFinder(): JSX.Element {
    var router = useRouter();
    var only = false;
    if (router.query.tool) {
        logger.info("query的内容为", router.query);
        var toolID = router.query.tool;
        var Tool: tJSXE;
        toolsInfo.forEach(si => {
            if (((tools[si.to] as tJSXE) != undefined) && (si.to == toolID) && si.goto == undefined) {
                Tool = tools[si.to];
                logger.info("<Tool />为", Tool);
            }
        });
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
            {router.query.tool != undefined && <Tool />}
        </>
    );
}