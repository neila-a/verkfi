"use client";
import {
    useLiveQuery
} from "dexie-react-hooks";
import db, {
    single
} from "../../components/db";
import {
    useSearchParams
} from "next/navigation";
import {
    emptyExtension
} from "./empties";
export default function ExtensionLoader() {
    const searchParams = useSearchParams(),
        toolID = searchParams.get("tool"),
        tool: single = useLiveQuery(() => db.extensionTools.get({
            to: toolID
        }), [], emptyExtension);
    return (
        <>
            <iframe style={{
                border: "none",
                width: "calc(100vw - 48px)",
                height: "100vh"
            }} src={`/extensionfiles/${tool.to}/${tool.main}`} />
        </>
    );
};