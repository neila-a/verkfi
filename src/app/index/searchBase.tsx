"use client";
import {
    tool
} from "tools/info";
export default function searchBase(sortedTools: tool[], search: string) {
    const calcTools: tool[] = [],
        lower = String(search).toLowerCase();
    sortedTools.forEach(tool => {
        const to = String(tool.to);
        if (tool.desc.toLowerCase().includes(lower) || to.includes(search) || tool.name.toLowerCase().includes(lower)) calcTools.push(tool);
    });
    return calcTools;
}
