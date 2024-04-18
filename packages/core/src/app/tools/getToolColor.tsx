"use client";
import {
    Hex
} from "declare";
import {
    tool
} from "./info";
export default function getToolColor(toolsInfo: tool[], toolID: string) {
    const tool = toolsInfo.find(si => si.to === toolID);
    if (tool !== undefined) {
        const tColor = tool.color;
        return `linear-gradient(45deg, #${tColor[0]}, #${tColor[1]})`;
    }
    return "";
}
