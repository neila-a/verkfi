"use client";
import {
    tool
} from "../tools/info";
export default function searchBase(sortedTools: tool[], search: string) {
    var calcTools: tool[] = [];
    const lower = String(search).toLowerCase();
    sortedTools.forEach(tool => {
        var to = String(tool.to);
        if (tool.desc.toLowerCase().includes(lower) || to.includes(search) || tool.name.toLowerCase().includes(lower)) calcTools.push(tool);
    });
    return calcTools;
}
