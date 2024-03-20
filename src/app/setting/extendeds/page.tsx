"use client";
import {
    Button,
    Paper,
    Stack,
    Typography,
    Divider,
    IconButton,
    Box,
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
interface setting {
    type: "boolean" | "switch" | "input",
    page: settingPage;
    switches?: string[];
    text: string;
    value: boolean | string;
    defaultValue: boolean | string;
}
export interface NXTMetadata extends noIconTool {
    icon: string;
    main: string;
    settings: setting[];
}
export const emptyNXTMetadata: NXTMetadata = {
    name: "",
    desc: "",
    to: "",
    icon: "",
    color: [Hex.hex("ffffff"), Hex.hex("ffffff")],
    main: "",
    settings: []
}
import {
    Add as AddIcon,
    Edit as EditIcon,
    SyncProblem as SyncProblemIcon,
    RestartAlt as RestartAltIcon
} from "@mui/icons-material";
import {
    useLiveQuery
} from "dexie-react-hooks";
import Image from "next/image";
import db, {
    single
} from "../../tools/extended/db";
import CheckDialog from "../../components/dialog/CheckDialog";
import DialogInputs from "./DialogInputs";
import {
    mostUsed as mostUsedContext,
    recentlyUsed as recentlyUsedContext
} from "../../layout/layoutClient";
import MouseOverPopover from "../../components/Popover";
import {
    settingPage
} from "../layout";
import {
    noIconTool
} from "../../tools/info";
import {
    Hex
} from "../../declare";
export type inputTypes = "modify" | "add";
export default function ExtendedManager() {
    const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false),
        [fileArray, setFileArray] = useState<FilePondFile[]>([]),
        [fileInfo, setFileInfo] = useState<NXTMetadata>(emptyNXTMetadata),
        [files, setFiles] = useState<[string, Uint8Array][]>([]),
        [removeDialogOpen, setRemoveDialogOpen] = useState<boolean>(false),
        [modifyDialogOpen, setModifyDialogOpen] = useState<boolean>(false),
        [clearData, setClearData] = useState<boolean>(false),
        recentlyUsed = useContext(recentlyUsedContext),
        mostUsed = useContext(mostUsedContext),
        reset = () => {
            setAddDialogOpen(false);
            setModifyDialogOpen(false);
            setRemoveDialogOpen(false);
            setFileArray([]);
            setFiles([]);
            setClearData(false);
            setFileInfo(emptyNXTMetadata);
        },
        extendedTools = useLiveQuery(() => db.extendedTools.toArray(), [], [] as single[]),
        packagedDialogInputs = (type: inputTypes) => <DialogInputs
            type={type}
            fileInfo={fileInfo}
            setFileInfo={setFileInfo}
            files={files}
            reset={reset}
            setModifyDialogOpen={setModifyDialogOpen}
            setRemoveDialogOpen={setRemoveDialogOpen}
        />
    async function clearExtendedData() {
        await db.extendedTools.put({
            ...fileInfo,
            files: files,
            settings: fileInfo.settings.map(setting => ({
                ...setting,
                value: setting.defaultValue
            }))
        });
        const oldRecently = JSON.parse(recentlyUsed.value) as string[];
        recentlyUsed.set(JSON.stringify(oldRecently.filter(item => item !== fileInfo.to)));
        const oldMost = JSON.parse(mostUsed.value) as {
            [key: string]: number;
        };
        Reflect.deleteProperty(oldMost, fileInfo.to);
        mostUsed.set(JSON.stringify(oldMost));
    }
    return (
        <>
            <Typography variant="h4">
                {get('extensions.扩展')}
            </Typography>
            <Stack spacing={2} mb={2}>
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
                        <Box display="flex">
                            <MouseOverPopover text={get("extensions.clear")}>
                                <IconButton onClick={event => {
                                    clearExtendedData();
                                }}>
                                    <RestartAltIcon />
                                </IconButton>
                            </MouseOverPopover>
                            <MouseOverPopover text={get("extensions.删除扩展")}>
                                <IconButton onClick={event => {
                                    setFiles(single.files);
                                    setFileInfo({
                                        ...single
                                    });
                                    setModifyDialogOpen(true);
                                }}>
                                    <EditIcon />
                                </IconButton>
                            </MouseOverPopover>
                        </Box>
                    </Box>
                </Paper>)}
            </Stack>
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
            <CheckDialog insert={<FormControlLabel control={<Checkbox value={clearData} onChange={event => {
                setClearData(event.target.checked);
            }} />} label={get("extensions.clear")} />} onFalse={() => {
                reset();
            }} onTrue={async () => {
                await db.extendedTools.delete(fileInfo.to);
                if (clearData) {
                    clearExtendedData();
                }
                reset();
            }} open={removeDialogOpen} title={get("extensions.删除扩展")} description={`${get("extensions.确定删除扩展")}${fileInfo.name}?`} />
            <PureDialog open={addDialogOpen} onClose={() => reset()} title={get("extensions.添加扩展")}>
                <FilePond
                    files={fileArray as unknown as FilePondServerConfigProps["files"]}
                    onupdatefiles={files => {
                        setFileArray(files);
                        const reader = new FileReader();
                        reader.onload = async function () {
                            const fs = new Filesystem(new Uint8Array(reader.result as ArrayBuffer)),
                                dir = fs.readdirSync("/").filter(item => item !== "package.json"),
                                main = JSON.parse(fs.readFileSync("package.json", true));
                            setFileInfo({
                                name: main.name,
                                to: main.to,
                                desc: main.description,
                                icon: main.icon,
                                color: main.color,
                                main: main.main,
                                settings: "settings" in main ? (main.settings as setting[]).map(settingItem => ({
                                    ...settingItem,
                                    value: settingItem.defaultValue
                                })) : []
                            });
                            setFiles(dir.map(item => [item, fs.readFileSync(item)]));
                            if ((await db.extendedTools.toArray()).some(item => item.to === main.to)) {
                                setModifyDialogOpen(true);
                                return setAddDialogOpen(false);
                            }
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