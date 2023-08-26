"use client";
import { tool } from "./tools/info";
import { logger } from './page';

/**
 * 排序工具
 * @param realTools 未排序的工具列表
 * @returns 经过排序的工具列表
 */
export function getToolsList(realTools) {
    const
        id = "toolslist", name = "工具列表", empty = realTools.map(atool => atool.to), value = localStorage.getItem(id);
    var _ret: tool[] = realTools;
    switch (value) {
        case null:
            localStorage.setItem(id, JSON.stringify(empty));
            logger.log(`检测到“${name}”为空，已设置为`, empty);
            _ret = realTools;
            break;
        default:
            logger.log(`检测到“${name}”为`, JSON.parse(value));
            const draft = (JSON.parse(value) as string[]).map(toolTo => {
                var realTool: tool;
                realTools.forEach(atool => {
                    if (atool.to == toolTo) {
                        realTool = atool;
                    }
                });
                return realTool;
            });
            _ret = draft;
            break;
    }
    return _ret;
}
