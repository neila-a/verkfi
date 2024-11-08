import {
    Getter,
    Setter
} from "jotai";
import type {
    useNavigate
} from "react-router-dom";
import {
    tool
} from "tools/info";
import {
    globalProps
} from "../consts";
type NavigateFunction = ReturnType<typeof useNavigate>;
export default function createHandler<prop extends keyof globalProps | "" = "", needNavigate extends boolean = false, needTool extends boolean = false>() {
    type end = (get: Getter, set: Setter, event: Event) => any;
    type propNoEmpty = Exclude<prop, "">;
    type selectedProps = Pick<globalProps, propNoEmpty>;
    type funcType = prop extends ""
        ? needNavigate extends true
            ? needTool extends true
                ? (tool: tool, navigate: NavigateFunction) => end
                : (navigate: NavigateFunction) => end
            : needTool extends true
                ? (tool: tool) => end
                : end
        : needNavigate extends true
            ? needTool extends true
                ? (props: selectedProps, tool: tool, navigate: NavigateFunction) => end
                : (props: selectedProps, navigate: NavigateFunction) => end
            : needTool extends true
                ? (props: selectedProps, tool: tool) => end
                : (props: selectedProps) => end
    return (func: funcType) => func;
}
