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
    Checkbox,
    useMediaQuery,
    useTheme,
    ButtonGroup
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
} from 'filepond'; import {
    Add as AddIcon,
    Edit as EditIcon,
    SyncProblem as SyncProblemIcon,
    RestartAlt as RestartAltIcon
} from "@mui/icons-material";
import {
    useLiveQuery
} from "dexie-react-hooks";
import db, {
    single
} from "../../components/db";
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
    emptyNXTMetadata
} from "../../tools/extension/empties";
export type inputTypes = "modify" | "add";
export default function ExtensionManager() {
    const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false),
        [fileArray, setFileArray] = useState<FilePondFile[]>([]),
        [fileInfo, setFileInfo] = useState<NXTMetadata>(emptyNXTMetadata),
        [files, setFiles] = useState<[string, Uint8Array][]>([]),
        [removeDialogOpen, setRemoveDialogOpen] = useState<boolean>(false),
        [modifyDialogOpen, setModifyDialogOpen] = useState<boolean>(false),
        [clearData, setClearData] = useState<boolean>(false),
        theme = useTheme(),
        fullScreen = useMediaQuery(theme.breakpoints.down('sm')),
        dialogButtons = (type: "modify" | "add") => <ButtonGroup fullWidth>
            {files.length !== 0 && <Button variant="contained" onClick={async (event) => {
                const id = await db.extensionTools.put({
                    ...fileInfo,
                    files: files
                });
                reset();
            }}>
                {type === "add" ? get("添加") : get("编辑")}
            </Button>}
            {type === "modify" && <Button variant="outlined" onClick={async (event) => {
                setModifyDialogOpen(false);
                setRemoveDialogOpen(true);
            }}>
                {get("删除")}
            </Button>}
        </ButtonGroup>,
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
        extensionTools = useLiveQuery(() => db.extensionTools.toArray(), [], [] as single[]),
        packagedDialogInputs = (type: inputTypes) => <DialogInputs
            type={type}
            fileInfo={fileInfo}
            setFileInfo={setFileInfo}
            files={files}
            reset={reset}
            setModifyDialogOpen={setModifyDialogOpen}
            setRemoveDialogOpen={setRemoveDialogOpen}
        />
    async function clearExtensionData(clearingExtension: NXTMetadata, clearingFiles: [string, Uint8Array][]) {
        await db.extensionTools.put({
            ...clearingExtension,
            files: clearingFiles,
            settings: clearingExtension.settings.map(setting => ({
                ...setting,
                value: setting.defaultValue
            }))
        });
        const oldRecently = recentlyUsed.value;
        recentlyUsed.set(oldRecently.filter(item => item !== clearingExtension.to));
        const oldMost = {
            ...mostUsed.value
        };
        Reflect.deleteProperty(oldMost, clearingExtension.to);
        mostUsed.set(oldMost);
    }
    return (
        <>
            <Typography variant="h4">
                {get('extensions.扩展')}
            </Typography>
            <Stack spacing={2} mb={2}>
                {extensionTools?.length === 0 ? <Box sx={{
                    color: theme => theme.palette.text.disabled,
                    textAlign: "center"
                }}>
                    <SyncProblemIcon sx={{
                        fontSize: "500%"
                    }} />
                    <Typography>
                        {get("extensions.未找到任何扩展")}
                    </Typography>
                </Box> : extensionTools?.map(single => <Paper sx={{
                    padding: 2
                }} key={single.to}>
                    <Box sx={{
                        display: "flex",
                        justifyContent: "space-between"
                    }}>
                        <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={2}>
                            <Stack direction="row" spacing={1}>
                                <Box>
                                    {/* 这里的图片是直接从indexedDB加载来的，不需要且不能使用next/image的优化 */}
                                    <img src={`/extensionfiles/${single.to}/${single.icon}`} alt={single.name} height={24} width={24} />
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
                                    const {
                                        files: thisFiles,
                                        ...metadata
                                    } = single;
                                    clearExtensionData(metadata, thisFiles);
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
            <PureDialog action={dialogButtons("modify")} add={{
                fullScreen: fullScreen
            }} open={modifyDialogOpen} onClose={event => {
                setModifyDialogOpen(false);
            }} title={get("extensions.编辑扩展")}>
                {packagedDialogInputs("modify")}
            </PureDialog>
            <CheckDialog insert={<FormControlLabel control={<Checkbox value={clearData} onChange={event => {
                setClearData(event.target.checked);
            }} />} label={get("extensions.clear")} />} onFalse={() => {
                reset();
            }} onTrue={async () => {
                await db.extensionTools.delete(fileInfo.to);
                if (clearData) {
                    clearExtensionData(fileInfo, files);
                }
                reset();
            }} open={removeDialogOpen} title={get("extensions.删除扩展")} description={`${get("extensions.确定删除扩展")}${fileInfo.name}?`} />
            <PureDialog action={dialogButtons("add")} add={{
                fullScreen: fullScreen
            }} open={addDialogOpen} onClose={() => reset()} title={get("extensions.添加扩展")}>
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
                            if ((await db.extensionTools.toArray()).some(item => item.to === main.to)) {
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
interface setting {
    type: "boolean" | "switch" | "input",
    page: settingPage;
    switches?: string[];
    text: string;
    id: string;
    value: boolean | string;
    defaultValue: boolean | string;
}
export interface NXTMetadata extends noIconTool {
    icon: string;
    main: string;
    settings: setting[];
}
