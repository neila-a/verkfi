"use client";
import {
    single
} from "db";
import {
    useSearchParams
} from "next/navigation";
import {
    extensions,
    isBrowser
} from "layout/layoutClient";
import {
    useContext,
    useRef
} from "react";
import {
    setting
} from "setting/extensions/page";
export default function ExtensionLoader() {
    const searchParams = useSearchParams(),
        toolID = searchParams.get("tool"),
        usedExtensions = useContext(extensions),
        tool: single = usedExtensions.value.find(a => a.to === toolID),
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
                        usedExtensions.set({
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
    return (
        <>
            <iframe ref={ref} id="iframe" style={{
                border: "none",
                width: "calc(100vw - 48px)",
                height: "100vh"
            }} src={src} />
        </>
    );
};