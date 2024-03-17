"use client";
import {
    useLiveQuery
} from "dexie-react-hooks";
import db, {
    single
} from "./db";
import {
    useSearchParams
} from "next/navigation";
import {
    emptyNXTMetadata
} from "../../setting/extendeds/page";
export const emptyExtended: single = {
    ...emptyNXTMetadata,
    files: []
}
export default function ExtendedLoader() {
    const searchParams = useSearchParams(),
        toolID = searchParams.get("tool"),
        tool: single = useLiveQuery(() => db.extendedTools.get({
            to: toolID
        }), [], emptyExtended);
    return (
        <>
            <iframe style={{
                border: "none",
                width: "calc(100vw - 48px)",
                height: "100vh"
            }} src={`/extendedfiles/${tool.to}/${tool.main}`} />
        </>
    );
}