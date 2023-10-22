"use client";
import {
    tool
} from "../tools/info";
import {
    logger
} from './consts';
/**
 * 排序工具
 * @param realTools 未排序的分类
 * @returns 经过排序的分类
 */
export default function getToolsList(realTools: tool[]) {
    const
        id = "toolslist", name = "分类", empty = realTools.map(atool => atool.to), value = localStorage.getItem(id);
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
