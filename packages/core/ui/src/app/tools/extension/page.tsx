"use client";
import {
    useAtom
} from "jotai";
import extensionsAtom from "@verkfi/shared/atoms/extensions";
import isBrowser from "@verkfi/shared/isBrowser";
import {
    useSearchParams
} from "next/navigation";
import {
    useRef
} from "react";
import {
    NXTMetadata
} from "setting/extensions/page";
import {
    setting
} from "setting/extensions/consts";
export default function ExtensionLoader() {
    const searchParams = useSearchParams(),
        toolID = searchParams.get("tool"),
        [extensionTools, setExtensions] = useAtom(extensionsAtom),
        tool: NXTMetadata = extensionTools.find(a => a.to === toolID),
        src = `/extensionfiles/${tool.to}/${tool.main}`,
        ref = useRef<HTMLIFrameElement>();
    if (isBrowser()) {
        window.addEventListener("message", (event: MessageEvent<{
            action: string;
            id?: string;
            value?: string | boolean;
        }>) => {
            if (event.origin === location.origin) {
                switch (event.data.action) {
                    case "setSetting":
                        setExtensions({
                            ...tool,
                            settings: tool.settings.map(set => {
                                if (set.id === event.data.id) {
                                    return {
                                        ...set,
                                        value: event.data.value
                                    } as setting;
                                }
                                return set;
                            })
                        });
                        break;
                    case "getSetting":
                        ref.current?.contentWindow?.postMessage?.({
                            value: tool.settings.find(set => set.id === event.data.id).value
                        }, location.origin);
                }
            }
        });
    }
    return <iframe ref={ref} id="iframe" style={{
        border: "none",
        width: "calc(100vw - 48px)",
        height: "100vh"
    }} src={src} />;
}
