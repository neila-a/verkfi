import dynamic from "next/dynamic";
import audiotools from "./audiotools/page";
import countletter from "./countletter/page";
import filter from "./filter/page";
import pi from "./pi/page";
import readnumber from "./readnumber/page";
import reversal from "./reversal/page";
import shaizi from "./shaizi/page";
import mathgen from "./mathgen/page";
import jigsaw from "./jigsaw/page";
const cubic = dynamic(() => import("./cubic/page"), {
    ssr: false,
});
import cylinder from "./cylinder/page";
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
