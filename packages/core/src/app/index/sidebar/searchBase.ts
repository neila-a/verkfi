"use client";
import {
    tool
} from "tools/info";
export default function searchBase(sortedTools: tool[], search: string) {
    const lower = String(search).toLowerCase();
    return sortedTools.filter(tool => {
        const to = String(tool.to);
        return tool.desc.toLowerCase().includes(lower) || to.includes(search) || tool.name.toLowerCase().includes(lower);
    })
}
