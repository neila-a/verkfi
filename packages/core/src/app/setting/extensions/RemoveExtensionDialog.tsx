"use client";
import {
    Checkbox,
    FormControlLabel
} from "@mui/material";
import CheckDialog from "@verkfi/shared/dialog/Check";
import {
    useAtom
} from "jotai";
import extensionsAtom from "@verkfi/shared/atoms/extensions";
import {
    listsAtom as listsAtom
} from "@verkfi/shared/atoms";
import {
    useState
} from "react";
import {
    get
} from "react-intl-universal";
import useClearExtensionData from "./clearExtensionData";
import {
    NXTMetadata
} from "./page";
import {
    file
} from "@verkfi/shared/reader/db";
export default function RemoveExtensionDialog(props: {
    open: boolean;
    reset: () => any;
    fileInfo: NXTMetadata;
    onTrue?: () => any;
    files: file[];
}) {
    const [clearData, setClearData] = useState<boolean>(false),
        clearExtensionData = useClearExtensionData(),
        [extensionsTools, setExtensions] = useAtom(extensionsAtom),
        [lists, setLists] = useAtom(listsAtom);
    return (
        <CheckDialog insert={<FormControlLabel control={(
            <Checkbox value={clearData} onChange={event => {
                setClearData(event.target.checked);
            }} />
        )} label={get("extensions.clear")} />} onFalse={() => {
            props.reset();
            setClearData(false);
        }} onTrue={async () => {
            setLists(lists.map(singleList => [singleList[0], singleList[1].filter(item => item !== `/tools/extension?tool=${props.fileInfo.to}`)]));
            if (clearData) {
                clearExtensionData(props.fileInfo);
            }
            setExtensions({
                ...props.fileInfo,
                action: "delete"
            });
            setClearData(false);
            if ("onTrue" in props) {
                props.onTrue();
            }
            return props.reset();
        }} open={props.open} title={get("extensions.删除扩展")} description={`${get("extensions.确定删除扩展")}${props.fileInfo.name}?`} />
    );
}
