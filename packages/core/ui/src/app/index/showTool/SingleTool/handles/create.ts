import {
    Getter,
    Setter
} from "jotai";
import {
    AppRouterInstance
} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {
    tool
} from "tools/info";
import {
    globalProps
} from "../consts";
export default function createHandler<prop extends keyof globalProps | "" = "", needRouter extends boolean = false, needTool extends boolean = false>() {
    type end = (get: Getter, set: Setter, event: Event) => any;
    type propNoEmpty = Exclude<prop, "">;
    type selectedProps = Pick<globalProps, propNoEmpty>;
    type funcType = prop extends ""
        ? needRouter extends true
            ? needTool extends true
                ? (tool: tool, router: AppRouterInstance) => end
                : (router: AppRouterInstance) => end
            : needTool extends true
                ? (tool: tool) => end
                : end
        : needRouter extends true
            ? needTool extends true
                ? (props: selectedProps, tool: tool, router: AppRouterInstance) => end
                : (props: selectedProps, router: AppRouterInstance) => end
            : needTool extends true
                ? (props: selectedProps, tool: tool) => end
                : (props: selectedProps) => end
    return (func: funcType) => func;
}
