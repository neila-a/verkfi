import {
    highElevation,
    lowElevation
} from "@verkfi/tool-pillar/SingleCollocation";
import {
    atom
} from "jotai";
import {
    atomWithReducer
} from "jotai/utils";
namespace atoms {
    export interface jump {
        to: string;
        name: string;
    }
    export namespace dialogOpen {
        export const jump = atom(false);
    }
    export const jump = atom({
        to: "",
        name: ""
    } as jump),
        elevation = atomWithReducer(lowElevation, (old, update: "low" | "high") => update === "low" ? lowElevation : highElevation);
}
export default atoms;
