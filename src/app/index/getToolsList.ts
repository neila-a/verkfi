"use client";
import {
    useLiveQuery
} from "dexie-react-hooks";
import db from "../components/db";
import {
    tool
} from "../tools/info";
import useReadSetting from "../setting/useReadSetting";
/**
 * 排序工具
 * @param realTools 未排序的工具列表
 * @returns 经过排序的工具列表
 */
export default function useToolsList(realTools: tool[]) {
    const id = "toolslist", name = "工具列表", empty = realTools.map(atool => atool.to), value = useReadSetting(id, empty);
    return value.map((toolTo: string) => {
        var realTool: tool;
        realTools.forEach(atool => {
            if (atool.to == toolTo) {
                realTool = atool;
            }
        });
        return realTool;
    });
}