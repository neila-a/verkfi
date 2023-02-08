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
        var toolID = router.query.tool[0];
        var Tool: tJSXE;
        toolsInfo.forEach(si => {
            if (tools[si.to] != undefined) {
                Tool = tools[si.to];
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
            <Tool />
        </>
    );
}