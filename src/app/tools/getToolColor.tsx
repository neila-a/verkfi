"use client";
import {
    Hex
} from "../declare";
import {
    tool
} from "./info";
export default function getToolColor(toolsInfo: tool[], toolID: string) {
    var tColor: [Hex.Hex, Hex.Hex] = toolsInfo.find(si => si.to === toolID).color,
        property: string = "";
    try {
        property = `linear-gradient(45deg, #${tColor[0]}, #${tColor[1]})`;
    } catch {
        property = "";
    }
    return property;
}
