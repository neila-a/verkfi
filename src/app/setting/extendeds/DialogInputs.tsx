"use client";
import {
    Button,
    ButtonGroup,
    FormGroup
} from "@mui/material";
import {
    get
} from "react-intl-universal";
import db from "../../extendedTools/db";
import InfoInput from "./infoInput";
import {
    setState
} from "../../declare";
import {
    inputTypes,
    NXTMetadata
} from "./page";
export default function DialogInputs(props: {
    type: inputTypes;
    fileInfo: NXTMetadata;
    setFileInfo: setState<NXTMetadata>;
    files: [string, Uint8Array][];
    reset(): void;
    setModifyDialogOpen: setState<boolean>;
    setRemoveDialogOpen: setState<boolean>;
}) {
    return (
        <>
            <FormGroup>
                {[["name", "名称"], ["to", "ID"], ["desc", "描述"], ["icon", "图标"], ["color", "背景色"], ["main", "入口"]].map(item => <InfoInput
                    id={item[0]}
                    key={item[0]}
                    name={item[1]}
                    info={props.fileInfo}
                    setInfo={props.setFileInfo} />)}
            </FormGroup>
            <ButtonGroup fullWidth>
                {props.files.length !== 0 && <Button variant="contained" onClick={async (event) => {
                    const id = await db.extendedTools.put({
                        ...props.fileInfo,
                        files: props.files,
                        color: props.fileInfo.color
                    });
                    props.reset();
                }}>
                    {props.type === "add" ? get("添加") : get("编辑")}
                </Button>}
                {props.type === "modify" && <Button variant="outlined" onClick={async (event) => {
                    props.setModifyDialogOpen(false);
                    props.setRemoveDialogOpen(true);
                }}>
                    {get("删除")}
                </Button>}
            </ButtonGroup>
        </>
    );
}
