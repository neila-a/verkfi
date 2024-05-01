"use client";
import {
    atom,
    useAtom
} from "jotai";
import extensionsAtom from "layout/extensionsAtom";
import {
    lists as listsAtom
} from "layout/layoutClient";
import {
    tool
} from "tools/info";
import convertExtensionTools from "../../convertExtensionTools";
const toolsListAtom = atom(get => {
    const lists = get(listsAtom),
        extensionTools = get(extensionsAtom),
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
            newLists.push(["__global__", realTools.concat(converted).map(tool => tool.to)])
            return realTools.concat(converted);
        }
        return list[1].map(to => realTools.concat(converted).find(tool => tool.to === to));
    }
});
export default toolsListAtom;