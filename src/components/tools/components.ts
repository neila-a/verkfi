import dynamic from "next/dynamic";
import audiotools from "../../tools/audiotools";
import countletter from "../../tools/countletter";
import filter from "../../tools/filter";
import pi from "../../tools/pi";
import readnumber from "../../tools/readnumber";
import reversal from "../../tools/reversal";
import shaizi from "../../tools/shaizi";
import mathgen from "../../tools/mathgen";
import jigsaw from "../../tools/jigsaw";
const cubic = dynamic(() => import("../../tools/cubic"), {
    ssr: false,
});
import cylinder from "../../tools/cylinder";
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