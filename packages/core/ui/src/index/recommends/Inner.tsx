"use client";
import ToolsStackWithTools from "index/showTool";
import recommendAtom from "@verkfi/shared/atoms/recommend";
import {
    useAtomValue
} from "jotai";
/**
 * 这是Recommends中需要挂起的组件。
 */
export default function InnerRecommends() {
    const recommend = useAtomValue(recommendAtom);
    return <ToolsStackWithTools paramTool={recommend.filter(item => item !== undefined)} />;
}
