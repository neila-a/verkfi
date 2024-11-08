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
    handleClickAtom = createHandler<"disableClick", true, true>()((props, tool, navigate) => (get, set, event) => {
        event.stopPropagation();
        if (!props?.disableClick) {
            if (tool.isGoto) {
                if (tool.to.startsWith("/tools/extension")) {
                    navigate(tool.to);
                } else {
                    set(atoms.dialogOpen.jump, true);
                    set(atoms.jump, {
                        ...tool
                    });
                }
            } else {
                navigate(`/tools/${tool.to}`);
            }
        }
    }),
    handleMouseEnterAtom = createHandler<"disableClick", false, true>()((props, tool) => (get, set) => {
        set(atoms.elevation, "high");
    }),
    handleMouseLeaveAtom = createHandler()((get, set) => {
        set(atoms.elevation, "low");
    });
