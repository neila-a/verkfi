"use client";
import {
    Button,
    Paper,
    Stack,
    Typography,
    Divider,
    IconButton,
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
export const emptyNXTMetadata: NXTMetadata = {
    name: "",
    desc: "",
    to: "",
    icon: "",
    color: ["", ""],
    main: ""
}
import {
    Add as AddIcon,
    Edit as EditIcon,
    SyncProblem as SyncProblemIcon
} from "@mui/icons-material";
import {
    useLiveQuery
} from "dexie-react-hooks";
import Image from "next/image";
import db from "../../tools/extended/db";
import CheckDialog from "../../components/dialog/CheckDialog";
import DialogInputs from "./DialogInputs";
export type inputTypes = "modify" | "add";
export default function ExtendedManager() {
    const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false),
        [fileArray, setFileArray] = useState<FilePondFile[]>([]),
        [fileInfo, setFileInfo] = useState<NXTMetadata>(emptyNXTMetadata),
        [files, setFiles] = useState<[string, Uint8Array][]>([]),
        [removeDialogOpen, setRemoveDialogOpen] = useState<boolean>(false),
        [modifyDialogOpen, setModifyDialogOpen] = useState<boolean>(false),
        reset = () => {
            setAddDialogOpen(false);
            setModifyDialogOpen(false);
            setRemoveDialogOpen(false);
            setFileArray([]);
            setFiles([]);
            setFileInfo(emptyNXTMetadata);
        },
        extendedTools = useLiveQuery(() => db.extendedTools.toArray(), [], []),
        packagedDialogInputs = (type: inputTypes) => <DialogInputs
            type={type}
            fileInfo={fileInfo}
            setFileInfo={setFileInfo}
            files={files}
            reset={reset}
            setModifyDialogOpen={setModifyDialogOpen}
            setRemoveDialogOpen={setRemoveDialogOpen}
        />
    return (
        <>
            <Typography variant="h4">
                {get('extensions.扩展')}
            </Typography>
            <Stack spacing={2}>
                {extendedTools?.length === 0 ? <Box sx={{
                    color: theme => theme.palette.text.disabled,
                    textAlign: "center"
                }}>
                    <SyncProblemIcon sx={{
                        fontSize: "500%"
                    }} />
                    <Typography>
                        {get("extensions.未找到任何扩展")}
                    </Typography>
                </Box> : extendedTools?.map(single => <Paper sx={{
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
                                    <Box display="flex" alignItems="center" justifyContent="space-between">
                                        <Typography variant="h6" fontWeight="700"> {/* <strong>的fontWeight是700 */}
                                            {get("ID")}
                                        </Typography>
                                        <Typography>
                                            {single.to}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Stack>
                            <Box>
                                <Typography variant="h6" fontWeight="700">
                                    {get('描述')}
                                </Typography>
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
                {packagedDialogInputs("modify")}
            </PureDialog>
            <CheckDialog open={removeDialogOpen} title={get("extensions.删除扩展")} description={`${get("extensions.确定删除扩展")}${fileInfo.name}?`} onFalse={() => {
                reset();
            }} onTrue={async () => {
                const id = await db.extendedTools.delete(fileInfo.to);
                reset();
            }} />
            <PureDialog open={addDialogOpen} onClose={() => reset()} title={get("extensions.添加扩展")}>
                <FilePond
                    files={fileArray as unknown as FilePondServerConfigProps["files"]}
                    onupdatefiles={files => {
                        setFileArray(files);
                        const reader = new FileReader();
                        reader.onload = function () {
                            const fs = new Filesystem(new Uint8Array(reader.result as ArrayBuffer)),
                                dir = fs.readdirSync("/").filter(item => item !== "package.json"),
                                main = JSON.parse(fs.readFileSync("package.json", true));
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
                        files.forEach(file => reader.readAsArrayBuffer(file.file));
                    }}
                    allowMultiple={true}
                    maxFiles={1}
                    name="files"
                    acceptedFileTypes={[".vxt"]}
                    labelIdle={get('drag.拖拽扩展到这里')}
                />
                {packagedDialogInputs("add")}
            </PureDialog>
        </>
    );
}