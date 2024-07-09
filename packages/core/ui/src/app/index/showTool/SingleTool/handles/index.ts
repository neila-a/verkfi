import {
    Route
} from "next";
import openWindow from "./openWindow";
import atoms from "../atoms";
import createHandler from "./create";
export const
    handleRightClickAtom = createHandler<"disableClick", false, true>()((props, tool) => (get, set, event) => {
        event.preventDefault();
        if (!props?.disableClick) {
            if (tool.isGoto) {
                if (tool.to.startsWith("/tools/extension")) {
                    openWindow(`${tool.to}&only=true`);
                } else {
                    set(atoms.dialogOpen.jump, true);
                    set(atoms.jump, {
                        ...tool
                    });
                }
            } else {
                openWindow(`/tools/${tool.to}?only=true`);
            }
        }
    }),
    handleClickAtom = createHandler<"disableClick", true, true>()((props, tool, router) => (get, set) => {
        if (!props?.disableClick) {
            if (tool.isGoto) {
                if (tool.to.startsWith("/tools/extension")) {
                    router.push(tool.to as Route);
                } else {
                    set(atoms.dialogOpen.jump, true);
                    set(atoms.jump, {
                        ...tool
                    });
                }
            } else {
                router.push(`/tools/${tool.to}` as Route);
            }
        }
    }),
    handleMouseEnterAtom = createHandler<"disableClick", true, true>()((props, tool, router) => (get, set) => {
        if (!props?.disableClick) {
            if (tool.isGoto) {
                if (tool.to.startsWith("/tools/extension")) {
                    router.prefetch(tool.to as Route);
                }
            } else {
                router.prefetch(`/tools/${tool.to}` as Route);
            }
        }
        set(atoms.elevation, "high");
    }),
    handleMouseLeaveAtom = createHandler()((get, set) => {
        set(atoms.elevation, "low");
    });
