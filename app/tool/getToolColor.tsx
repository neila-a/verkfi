"use client";
import {
    tool
} from "../tools/info";
export default function getToolColor(toolsInfo: tool[], toolID: string) {
    var tColor: [string, string],
        property: string = "";
    toolsInfo.forEach(si => {
        if (si.to == toolID) tColor = si.color;
    });
    try {
        property = "linear-gradient(45deg, #" + tColor[0] + ", #" + tColor[1] + ")";
    } catch {
        property = "";
    }
    return property;
}
