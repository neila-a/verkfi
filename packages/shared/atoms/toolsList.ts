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
} from "@verkfi/core-ui/src/tools/info";
import {
    globalList
} from "@verkfi/core-ui/src/index/atoms";
const toolsListAtom = atom(async get => {
    const lists = get(listsAtom),
        converted = await get(convertedExtensionsAtom),
        realTools = get(toolsInfoAtom);
    const concated = realTools.concat(converted), got = lists.get(globalList);
    if (got) {
        return got.map(to => concated.find(tool => tool.to === to) as tool);
    }
    return concated;
});
export default toolsListAtom;
