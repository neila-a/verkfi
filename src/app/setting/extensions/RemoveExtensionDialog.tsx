"use client";
import {
    FormControlLabel,
    Checkbox
} from "@mui/material";
import {
    useContext,
    useState
} from "react";
import {
    get
} from "react-intl-universal";
import db from "db";
import CheckDialog from "dialog/Check";
import {
    lists as listsContext,
    mostUsed as mostUsedContext,
    recentlyUsed as recentlyUsedContext
} from "layout/layoutClient";
import clearExtensionData from "./clearExtensionData";
import {
    NXTMetadata
} from "./page";
export default function RemoveExtensionDialog(props: {
    open: boolean;
    reset: () => any;
    fileInfo: NXTMetadata;
    onTrue?: () => any;
    files: [string, Uint8Array][];
}) {
    const [clearData, setClearData] = useState<boolean>(false),
        recentlyUsed = useContext(recentlyUsedContext),
        mostUsed = useContext(mostUsedContext),
        lists = useContext(listsContext);
    return (
        <CheckDialog insert={<FormControlLabel control={<Checkbox value={clearData} onChange={event => {
            setClearData(event.target.checked);
        }} />} label={get("extensions.clear")} />} onFalse={() => {
            props.reset();
            setClearData(false);
        }} onTrue={async () => {
            debugger
            if (lists.value !== undefined) {
                lists.set(lists.value.map(singleList => [singleList[0], singleList[1].filter(item => item !== `/tools/extension?tool=${props.fileInfo.to}`)]));
            }
            if (clearData) {
                clearExtensionData(props.fileInfo, props.files, recentlyUsed, mostUsed);
            }
            await db.extensionTools.delete(props.fileInfo.to);
            setClearData(false);
            if ("onTrue" in props) {
                props.onTrue();
            }
            return props.reset();
        }} open={props.open} title={get("extensions.删除扩展")} description={`${get("extensions.确定删除扩展")}${props.fileInfo.name}?`} />
    );
}
