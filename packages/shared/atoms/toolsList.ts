"use client";
import {
    atom
} from "jotai";
import extensionsAtom from "./extensions";
import {
    listsAtom as listsAtom
} from ".";
import toolsInfoAtom from "tools/info";
import {
    loadable
} from "jotai/utils";
import convertExtensionTools from "index/convertExtensionTools";
const toolsListAtom = atom(async get => {
    const lists = await get(listsAtom),
        extensionTools = await get(extensionsAtom),
        converted = convertExtensionTools(extensionTools),
        list = lists.find(item => item[0] === "__global__"),
        realTools = await get(toolsInfoAtom);
    if (list === undefined) {
        const newLists = lists.slice(0);
        newLists.push(["__global__", realTools.concat(converted).map(tool => tool.to)]);
        return realTools.concat(converted);
    }
    return list[1].map(to => realTools.concat(converted).find(tool => tool.to === to));
});
export const loadableToolsListAtom = loadable(toolsListAtom);
export default toolsListAtom;
