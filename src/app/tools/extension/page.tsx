"use client";
import {
    useLiveQuery
} from "dexie-react-hooks";
import db, {
    single
} from "db";
import {
    useSearchParams
} from "next/navigation";
import {
    emptyExtension
} from "./empties";
import {
    isBrowser
} from "layout/layoutClient";
export default function ExtensionLoader() {
    const searchParams = useSearchParams(),
        toolID = searchParams.get("tool"),
        tool: single = useLiveQuery(() => db.extensionTools.get({
            to: toolID
        }), [], emptyExtension),
            src = `/extensionfiles/${tool.to}/${tool.main}`;
    if (isBrowser()) {
        window.addEventListener("message", (event: MessageEvent<{
            action: string;
            id?: string;
            value?: string | boolean;
        }>) => {
            if (event.origin === location.origin) {
                switch (event.data.action) {
                    case "setSetting":
                        db.extensionTools.put({
                            ...tool,
                            settings: tool.settings.map(set => {
                                if (set.id === event.data.id) {
                                    return {
                                        ...set,
                                        value: event.data.value
                                    };
                                }
                                return set;
                            })
                        });
                        break;
                    case "getSetting":
                        (document.getElementById("iframe") as HTMLIFrameElement).contentWindow.postMessage({
                            value: tool.settings.find(set => set.id === event.data.id).value
                        }, location.origin); 
                }
            }
        });
    }
    return (
        <>
            <iframe id="iframe" style={{
                border: "none",
                width: "calc(100vw - 48px)",
                height: "100vh"
            }} src={src} />
        </>
    );
};