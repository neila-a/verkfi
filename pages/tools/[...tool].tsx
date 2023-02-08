import {
    useRouter
} from "next/router";
import React from "react";
import HeadBar from "../../components/HeadBar";
import audiotools from "../../tools/audiotools";
import clock from "../../tools/clock";
import countletter from "../../tools/countletter";
import filter from "../../tools/filter";
import keycode from "../../tools/keycode";
import pi from "../../tools/pi";
import readnumber from "../../tools/readnumber";
import reversal from "../../tools/reversal";
import shaizi from "../../tools/shaizi";
import {
    realTools as toolsInfo
} from "..";
import {
    Typography
} from "@mui/material";
import lpLogger from "lp-logger";
export var logger = new lpLogger({
    name: "ToolFinder",
    level: "log"
});
export const tools = {
    audiotools,
    clock,
    countletter,
    filter,
    keycode,
    pi,
    readnumber,
    reversal,
    shaizi
};
export type tJSXE = () => JSX.Element;
export default function ToolFinder(): JSX.Element {
    var router = useRouter();
    if (router.query.tool) {
        logger.info("query的内容为", router.query);
        var toolID = router.query.tool[0];
        var Tool: tJSXE;
        toolsInfo.forEach(si => {
            if (((tools[si.to] as tJSXE) != undefined) && (si.to == toolID)) {
                Tool = tools[si.to];
                logger.info("<Tool />为", Tool);
            }
        });
    }
    return (
        <>
            <HeadBar isIndex={false} pageName={(() => {
                var name: string;
                toolsInfo.forEach(si => {
                    if (si.to == toolID) name = si.name;
                });
                return name;
            })()} />
            {router.query.tool == undefined ? <Typography variant="body1" gutterBottom>未找到工具</Typography> : <Tool />}
        </>
    );
}