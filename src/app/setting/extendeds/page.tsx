"use client";
import {
    Button,
    Paper,
    Stack,
    Typography,
    Divider,
    TextField,
    IconButton,
    ButtonGroup,
    Box
} from "@mui/material";
import {
    useState
} from "react";
import {
    get
} from "react-intl-universal";
import {
    Filesystem
} from "@tybys/browser-asar";
import {
    FilePond
} from 'react-filepond'; // Import React FilePond
import dynamic from "next/dynamic";
const PureDialog = dynamic(() => import("../../components/dialog/PureDialog"));
import {
    FilePondFile,
    FilePondServerConfigProps
} from 'filepond';
/**
 * In PluginDevelpmenting.md
 */
export interface NXTMetadata {
    name: string;
    to: Lowercase<string>;
    desc: string;
    icon: string;
    color: [string, string];
    main: string;
}
const emptyNXTMetadata: NXTMetadata = {
    name: "",
    desc: "",
    to: "",
    icon: "",
    color: ["", ""],
    main: ""
}
import {
    Add as AddIcon,
    Edit as EditIcon
} from "@mui/icons-material";
import {
    useLiveQuery
} from "dexie-react-hooks";
import Image from "next/image";
import db from "../../extendedTools/db";
import CheckDialog from "../../components/dialog/CheckDialog";
export default function ExtendedManager() {
    var [addDialogOpen, setAddDialogOpen] = useState<boolean>(false),
        [fileArray, setFileArray] = useState<FilePondFile[]>([]),
        [fileInfo, setFileInfo] = useState<NXTMetadata>(emptyNXTMetadata),
        [files, setFiles] = useState<[string, Uint8Array][]>([]),
        [removeDialogOpen, setRemoveDialogOpen] = useState<boolean>(false),
        [modifyDialogOpen, setModifyDialogOpen] = useState<boolean>(false);
    const reset = () => {
        setAddDialogOpen(false);
        setModifyDialogOpen(false);
        setRemoveDialogOpen(false);
        setFileArray([]);
        setFiles([]);
        setFileInfo(emptyNXTMetadata);
    },
        extendedTools = useLiveQuery(() => db.extendedTools.toArray());
    function DialogInputs(props: {
        type: "modify" | "add"
    }) {
        return (
            <>
                {[["name", "名称"], ["to", "ID"], ["desc", "描述"], ["icon", "图标"], ["color", "背景色"], ["main", "入口"]].map(item => (
                    <TextField key={item[0]} margin="dense" value={fileInfo[item[0]]} label={get(item[1])} fullWidth variant="outlined" onChange={event => {
                        var bufferInfo: NXTMetadata = JSON.parse(JSON.stringify(fileInfo));
                        bufferInfo[item[0]] = event.target.value;
                        setFileInfo(bufferInfo);
                    }} />
                ))}
                <ButtonGroup fullWidth>
                    {files.length !== 0 && <Button variant="contained" onClick={async event => {
                        const id = await db.extendedTools.put({
                            ...fileInfo,
                            files,
                            color: fileInfo.color
                        });
                        reset();
                    }}>
                        {props.type === "add" ? get("添加") : get("编辑")}
                    </Button>}
                    {props.type === "modify" && <Button variant="outlined" onClick={async event => {
                        setModifyDialogOpen(false);
                        setRemoveDialogOpen(true);
                    }}>
                        {get("删除")}
                    </Button>}
                </ButtonGroup>
            </>
        );
    }
    return (
        <>
            <Typography variant="h4">
                {get('extensions.扩展')}
            </Typography>
            <Stack spacing={2}>
                {extendedTools?.map(single => <Paper sx={{
                    padding: 2
                }} key={single.to}>
                    <Box sx={{
                        display: "flex",
                        justifyContent: "space-between"
                    }}>
                        <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={2}>
                            <Stack direction="row" spacing={1}>
                                <Box>
                                    <Image src={`/extendedfiles/${single.to}/${single.icon}`} alt={single.name} height={24} width={24} />
                                </Box>
                                <Box>
                                    <Typography>
                                        {single.name}
                                    </Typography>
                                    <Typography>
                                        <strong>{get("ID")}</strong> {single.to}
                                    </Typography>
                                </Box>
                            </Stack>
                            <Box>
                                <strong>{get('描述')}</strong>
                                <br />
                                {single.desc}
                            </Box>
                        </Stack>
                        <IconButton onClick={event => {
                            setFiles(single.files);
                            setFileInfo({
                                ...single
                            });
                            setModifyDialogOpen(true);
                        }}>
                            <EditIcon />
                        </IconButton>
                    </Box>
                </Paper>)}
            </Stack>
            <br />
            <Button startIcon={<AddIcon />} fullWidth onClick={event => {
                setAddDialogOpen(true);
            }} variant="outlined">
                {get("extensions.添加扩展")}
            </Button>
            <PureDialog open={modifyDialogOpen} onClose={event => {
                setModifyDialogOpen(false);
            }} title={get("extensions.编辑扩展")}>
                <DialogInputs type="modify" />
            </PureDialog>
            <CheckDialog open={removeDialogOpen} title={get("extensions.删除扩展")} description={`${get("extensions.确定删除扩展")}${fileInfo.name}?`} onFalse={() => {
                reset();
            }} onTrue={async () => {
                const id = await db.extendedTools.delete(fileInfo.to);
                reset();
            }} />
            <PureDialog open={addDialogOpen} onClose={() => {
                reset();
            }} title={get("extensions.添加扩展")}>
                <FilePond
                    files={fileArray as unknown as FilePondServerConfigProps["files"]}
                    onupdatefiles={files => {
                        setFileArray(files);
                        const reader = new FileReader();
                        reader.onload = function () {
                            const fs = new Filesystem(new Uint8Array(reader.result as ArrayBuffer));
                            const dir = fs.readdirSync("/").filter(item => item !== "package.json");
                            const main = JSON.parse(fs.readFileSync("package.json", true));
                            setFileInfo({
                                name: main.name,
                                to: main.to,
                                desc: main.description,
                                icon: main.icon,
                                color: main.color,
                                main: main.main
                            });
                            var stageFiles: [string, Uint8Array][] = [];
                            dir.forEach(item => stageFiles.push([item, fs.readFileSync(item)]));
                            setFiles(stageFiles);
                        };
                        reader.readAsArrayBuffer(files[0].file);
                    }}
                    allowMultiple={true}
                    maxFiles={1}
                    name="files"
                    labelIdle={get('drag.拖拽扩展到这里')}
                />
                <DialogInputs type="add" />
            </PureDialog>
        </>
    );
}