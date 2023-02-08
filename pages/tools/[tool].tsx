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
    Audiotools: audiotools,
    Clock: clock,
    CountLetter: countletter,
    Filter: filter,
    Keycode: keycode,
    Pi: pi,
    Readnumber: readnumber,
    Reversal: reversal,
    Shaizi: shaizi
};
export type tJSXE = () => JSX.Element;
export default function ToolFinder(): JSX.Element {
    var router = useRouter();
    const tool = router.query.tool as unknown as string;
    const toolComName = tool[0].toUpperCase() + tool.slice(1);
    const Tool = tools[toolComName] as tJSXE;
    return (
        <>
            <HeadBar isIndex={false} pageName={(() => {
                var name: string;
                toolsInfo.forEach(si => {
                    if (si.to == tool) name = si.name;
                });
                return name;
            })()} />
            <Tool />
        </>
    );
}