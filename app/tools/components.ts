import dynamic from "next/dynamic";
import audiotools from "./audiotools/tool";
import countletter from "./countletter/tool";
import filter from "./filter/tool";
import pi from "./pi/tool";
import readnumber from "./readnumber/tool";
import reversal from "./reversal/tool";
import shaizi from "./shaizi/tool";
import mathgen from "./mathgen/tool";
import jigsaw from "./jigsaw/tool";
const cubic = dynamic(() => import("./cubic/tool"), {
    ssr: false,
});
import cylinder from "./cylinder/tool";
export const components = {
    audiotools,
    countletter,
    filter,
    pi,
    readnumber,
    reversal,
    shaizi,
    mathgen,
    cubic,
    jigsaw,
    cylinder
};
export default components;
