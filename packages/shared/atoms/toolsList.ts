import {
    atom
} from "jotai";
import {
    convertedExtensionsAtom
} from "./extensions";
import {
    listsAtom
} from ".";
import toolsInfoAtom, {
    tool
} from "@verkfi/core-ui/src/app/tools/info";
import awaiter from "../reader/awaiter";
import {
    lists
} from "@verkfi/core-ui/src/app/index/sidebar";
import {
    globalListSymbol
} from "@verkfi/core-ui/src/app/index/atoms";
const toolsListAtom = atom(get => awaiter(
    get(listsAtom), (lists: lists) => awaiter(
        get(convertedExtensionsAtom), converted => awaiter(
            get(toolsInfoAtom), realTools => {
                const concated = realTools.concat(converted),
                    got = lists.get(globalListSymbol);
                if (got) {
                    return got.map(to => concated.find(tool => tool.to === to) as tool);
                }
                return concated;
            }
        )
    )
));
export default toolsListAtom;
