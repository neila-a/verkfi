"use client";
import {
    FormGroup,
    MenuItem,
    Select,
    TextField
} from "@mui/material";
import {
    hex
} from "declare";
import {
    get
} from "react-intl-universal";
import InfoInput from "./infoInput";
import {
    inputTypes
} from "./page";
import HexColor = hex.HexColor;
import {
    fileInfoAtom,
    filesAtom
} from "./atoms";
import {
    useAtom,
    useAtomValue
} from "jotai";
export default function DialogInputs(props: {
    type: inputTypes;
    reset(): void;
}) {
    const [fileInfo, setFileInfo] = useAtom(fileInfoAtom),
        files = useAtomValue(filesAtom);
    return (
        <>
            <FormGroup>
                {[["name", "名称"], ["to", "ID"], ["desc", "描述"]].map(item => <InfoInput
                    id={item[0]}
                    key={item[0]}
                    name={item[1]}
                />)}
            </FormGroup>
            <FormGroup sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between"
            }}>
                {[0, 1].map(item => <TextField sx={{
                    maxWidth: "49%"
                }} key={item} margin="dense" variant="outlined" onChange={event => {
                    setFileInfo(old => {
                        const realOld = {
                            ...old
                        };
                        realOld.color[item] = hex(event.target.value as HexColor<string>);
                        return realOld;
                    });
                }} value={fileInfo.color[item]} label={get("appearance.colorSteps") + item} />
                )}
            </FormGroup>
            <FormGroup>
                {[["icon", "图标"], ["main", "入口"]].map(item => <Select sx={{
                    mb: 1
                }} key={item[0]} value={fileInfo[item[0]]} label={get(item[1])} onChange={event => {
                    setFileInfo(old => {
                        const realOld = {
                            ...old
                        };
                        realOld[item[0]] = event.target.value;
                        return realOld;
                    });
                }}>
                    {files.map(file => <MenuItem key={file.path} value={file.path}>
                        {file.path}
                    </MenuItem>
                    )}
                </Select>
                )}
            </FormGroup>
        </>
    );
}
