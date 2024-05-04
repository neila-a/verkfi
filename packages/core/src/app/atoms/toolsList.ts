"use client";
import {
    atom
} from "jotai";
import extensionsAtom from "atoms/extensions";
import {
    lists as listsAtom
} from "atoms";
import {
    tool
} from "tools/info";
import {
    loadable
} from "jotai/utils";
import convertExtensionTools from "../index/convertExtensionTools";
const toolsListAtom = atom(async get => {
    const lists = await get(listsAtom),
        extensionTools = await get(extensionsAtom),
        converted = convertExtensionTools(extensionTools),
        list = lists.find(item => item[0] === "__global__");
    /**
     * 排序工具
     * @param realTools 未排序的工具列表
     * @returns 经过排序的工具列表
     */
    return (realTools: tool[]) => {
        if (list === undefined) {
            const newLists = lists.slice(0);
            newLists.push(["__global__", realTools.concat(converted).map(tool => tool.to)]);
            return realTools.concat(converted);
        }
        return list[1].map(to => realTools.concat(converted).find(tool => tool.to === to));
    };
});
export const loadableToolsListAtom = loadable(toolsListAtom);
export default toolsListAtom;
