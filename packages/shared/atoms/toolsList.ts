import {
    atom
} from "jotai";
import {
    convertedExtensionsAtom
} from "./extensions";
import {
    listsAtom
} from ".";
import toolsInfoAtom from "@verkfi/core-ui/src/app/tools/info";
import awaiter from "../reader/awaiter";
const toolsListAtom = atom(get => awaiter(
    get(listsAtom), lists => awaiter(
        get(convertedExtensionsAtom), converted => awaiter(
            get(toolsInfoAtom), realTools => {
                const list = lists.find(item => item[0] === "__global__");
                if (list === undefined) {
                    const newLists = lists.slice(0);
                    newLists.push(["__global__", realTools.concat(converted).map(tool => tool.to)]);
                    return realTools.concat(converted);
                }
                return list[1].map(to => realTools.concat(converted).find(tool => tool.to === to));
            }
        )
    )
));
export default toolsListAtom;
