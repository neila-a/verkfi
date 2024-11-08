import {
    tool
} from "tools/info";
export default function getToolHref(tool: tool) {
    if (tool.isGoto) {
        return tool.to;
    }
    return `/tools/${tool.to}`;
}
