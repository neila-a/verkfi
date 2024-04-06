"use client";
import {
    FormGroup,
    MenuItem,
    Select,
    TextField
} from "@mui/material";
import {
    get
} from "react-intl-universal";
import InfoInput from "./infoInput";
import {
    Hex,
    setState
} from "declare";
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
                {[["name", "名称"], ["to", "ID"], ["desc", "描述"]].map(item => <InfoInput
                    id={item[0]}
                    key={item[0]}
                    name={item[1]}
                    info={props.fileInfo}
                    setInfo={props.setFileInfo} />)}
            </FormGroup>
            <FormGroup sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between"
            }}>
                {[0, 1].map(item => (
                    <TextField sx={{
                        maxWidth: "49%"
                    }} key={item} margin="dense" variant="outlined" onChange={event => {
                        props.setFileInfo(old => {
                            const realOld = {
                                ...old
                            };
                            realOld.color[item] = Hex.hex(event.target.value as Hex.HexColor<string>);
                            return realOld;
                        });
                    }} value={props.fileInfo.color[item]} label={get("theme.colorSteps") + item} />
                ))}
            </FormGroup>
            <FormGroup>
                {[["icon", "图标"], ["main", "入口"]].map(item => (
                    <Select sx={{
                        mb: 1
                    }} key={item[0]} value={props.fileInfo[item[0]]} label={get(item[1])} onChange={event => {
                        props.setFileInfo(old => {
                            const realOld = {
                                ...old
                            };
                            realOld[item[0]] = event.target.value;
                            return realOld;
                        })
                    }}>
                        {props.files.map(file => (
                            <MenuItem key={file[0]} value={file[0]}>{file[0]}</MenuItem>
                        ))}
                    </Select>
                ))}
            </FormGroup>
        </>
    );
}
