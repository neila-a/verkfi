"use client";
import ToolsStack from "index/showTool";
import recommendAtom from "@verkfi/shared/atoms/recommend";
import {
    useAtomValue
} from "jotai";
/**
 * 这是Recommends中需要挂起的组件。
 */
export default function InnerRecommends() {
    const recommend = useAtomValue(recommendAtom);
    return <ToolsStack paramTool={recommend.filter(item => item !== undefined)} />;
}
