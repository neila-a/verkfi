"use client";
import {
    tool
} from "tools/info";
import db from "db";
import convertExtensionTools from "./convertExtensionTools";
import {
    useLiveQuery
} from "dexie-react-hooks";
import {
    useContext
} from "react";
import {
    extensions,
    lists as listsContext
} from "layout/layoutClient";
/**
 * 排序工具
 * @param realTools 未排序的工具列表
 * @returns 经过排序的工具列表
 */
const useToolsList = (realTools: tool[]) => {
    const lists = useContext(listsContext).value,
        extensionTools = useContext(extensions).value,
        converted = convertExtensionTools(extensionTools),
        list = lists.find(item => item[0] === "__global__");
    if (list === undefined) {
        const newLists = lists.slice(0);
        newLists.push(["__global__", realTools.concat(converted).map(tool => tool.to)])
        return realTools.concat(converted);
    }
    return list[1].map(to => realTools.concat(converted).find(tool => tool.to === to));
}
export default useToolsList;