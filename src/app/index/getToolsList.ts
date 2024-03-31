"use client";
import {
    tool
} from "../tools/info";
import useReadSetting from "../setting/useReadSetting";
/**
 * 排序工具
 * @param realTools 未排序的工具列表
 * @returns 经过排序的工具列表
 */
const useToolsList = (realTools: tool[]) => useReadSetting("toolslist", realTools.map(atool => atool.to)).map((toolTo: string) => realTools.find(atool => atool.to === toolTo));
export default useToolsList;