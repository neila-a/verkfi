"use client";
import {
    Box,
    IconButton,
    Stack,
    Typography,
    useMediaQuery,
    useTheme
} from "@mui/material";
import {
    Filesystem
} from "@tybys/browser-asar";
import No from "@verkfi/shared/No";
import {
    FilePondFile,
    FilePondServerConfigProps
} from "filepond";
import {
    Provider,
    useAtom,
    useAtomValue
} from "jotai";
import extensionsAtom from "@verkfi/shared/atoms/extensions";
import dynamic from "next/dynamic";
import {
    useState
} from "react";
import {
    FilePond
} from "react-filepond"; // Import React FilePond
import {
    get
} from "react-intl-universal";
import {
    emptyNXTMetadata
} from "tools/extension/empties";
import {
    noIconTool
} from "tools/info";
import {
    settingPage
} from "../layout";
import DialogButtons from "./DialogButtons";
import DialogInputs from "./DialogInputs";
import RemoveExtensionDialog from "./RemoveExtensionDialog";
import {
    file
} from "@verkfi/shared/reader/db";
import ToolsStack from "index/showTool";
import convertExtensionTools from "index/convertExtensionTools";
import MouseOverPopover from "@verkfi/shared/Popover";
import {
    Edit,
    RestartAlt
} from "@mui/icons-material";
import useClearExtensionData from "./clearExtensionData";
const PureDialog = dynamic(() => import("@verkfi/shared/dialog/Pure"));
export type inputTypes = "modify" | "add";
export default function ExtensionManager() {
    const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false),
        [fileArray, setFileArray] = useState<FilePondFile[]>([]),
        [fileInfo, setFileInfo] = useState<NXTMetadata>(emptyNXTMetadata),
        [files, setFiles] = useState<file[]>([]),
        [removeDialogOpen, setRemoveDialogOpen] = useState<boolean>(false),
        [modifyDialogOpen, setModifyDialogOpen] = useState<boolean>(false),
        clearExtensionData = useClearExtensionData(),
        theme = useTheme(),
        fullScreen = useMediaQuery(theme.breakpoints.down("sm")),
        reset = () => {
            setAddDialogOpen(false);
            setModifyDialogOpen(false);
            setRemoveDialogOpen(false);
            setFileArray([]);
            setFiles([]);
            setFileInfo(emptyNXTMetadata);
        },
        extensionTools = useAtomValue(extensionsAtom),
        packagedDialogInputs = (type: inputTypes) => <DialogInputs
            type={type}
            fileInfo={fileInfo}
            setFileInfo={setFileInfo}
            files={files}
            reset={reset}
            setModifyDialogOpen={setModifyDialogOpen}
            setRemoveDialogOpen={setRemoveDialogOpen}
        />;
    return (
        <>
            <Typography variant="h4">
                {get("extensions.扩展")}
            </Typography>
            <Box sx={{
                mb: 2
            }}>
                <Provider>
                    <ToolsStack paramTool={extensionTools?.map(single => ({
                        ...convertExtensionTools([single])[0]
                    }))} notfound={(
                        <No>
                            {get("extensions.未找到任何扩展")}
                        </No>
                    )} actions={extensionTools?.map(single => (
                        <>
                            <MouseOverPopover text={get("extensions.clear")}>
                                <IconButton onClick={event => {
                                    const {
                                        ...metadata
                                    } = single;
                                    clearExtensionData(metadata);
                                }} aria-label={get("extensions.clear")}>
                                    <RestartAlt />
                                </IconButton>
                            </MouseOverPopover>
                            <MouseOverPopover text={get("extensions.删除扩展")}>
                                <IconButton onClick={event => {
                                    setFileInfo({
                                        ...single
                                    });
                                    setModifyDialogOpen(true);
                                }} aria-label={get("extensions.删除扩展")}>
                                    <Edit />
                                </IconButton>
                            </MouseOverPopover>
                        </>
                    ))} disableClick />
                </Provider>
            </Box>
            <FilePond
                files={fileArray as unknown as FilePondServerConfigProps["files"]}
                onupdatefiles={files => {
                    setFileArray(files);
                    const reader = new FileReader();
                    reader.onload = function () {
                        const fs = new Filesystem(new Uint8Array(reader.result as ArrayBuffer)),
                            dir = fs.readdirSync("/"),
                            main = JSON.parse(fs.readFileSync("package.json", true));
                        setFileInfo({
                            name: main.name,
                            to: main.to,
                            desc: main.description,
                            icon: main.icon,
                            color: main.color,
                            main: main.main,
                            settings: "settings" in main ? (main.settings satisfies setting[]).map((settingItem: setting) => ({
                                ...settingItem,
                                value: settingItem.defaultValue
                            })) : []
                        });
                        function readInternal(path: string): file | file[] {
                            const stat = fs.statSync(path);
                            if (stat.isDirectory()) {
                                return fs.readdirSync(path).map(pathchild => readInternal(`${path}/${pathchild}`)).flat(20);
                            }
                            return {
                                path,
                                file: fs.readFileSync(path)
                            };
                        }
                        setFiles(dir.map(readInternal).flat(1));
                        if (extensionTools.some(item => item.to === main.to)) {
                            setModifyDialogOpen(true);
                            return setAddDialogOpen(false);
                        }
                    };
                    files.forEach(file => reader.readAsArrayBuffer(file.file));
                    if (files.length > 0) {
                        setAddDialogOpen(true);
                    }
                }}
                allowMultiple
                maxFiles={1}
                name="files"
                acceptedFileTypes={[".vxt"]}
                labelIdle={get("drag.extensionAdd")}
            />
            <RemoveExtensionDialog open={removeDialogOpen} reset={reset} fileInfo={fileInfo} files={files} />
            <PureDialog action={(
                <DialogButtons
                    type="add"
                    fileInfo={fileInfo}
                    setModifyDialogOpen={setModifyDialogOpen}
                    setRemoveDialogOpen={setRemoveDialogOpen}
                    files={files}
                    reset={reset}
                />
            )} add={{
                fullScreen: fullScreen
            }} open={addDialogOpen} onClose={() => reset()} title={get("extensions.添加扩展")}>
                {packagedDialogInputs("add")}
            </PureDialog>
            <PureDialog action={(
                <DialogButtons
                    type="modify"
                    fileInfo={fileInfo}
                    setModifyDialogOpen={setModifyDialogOpen}
                    setRemoveDialogOpen={setRemoveDialogOpen}
                    files={files}
                    reset={reset}
                />
            )} add={{
                fullScreen: fullScreen
            }} open={modifyDialogOpen} onClose={event => {
                setModifyDialogOpen(false);
            }} title={get("extensions.编辑扩展")}>
                {packagedDialogInputs("modify")}
            </PureDialog>
        </>
    );
}
interface booleanSetting {
    type: "boolean",
    page: settingPage;
    text: string;
    id: string;
    value: boolean;
    defaultValue: boolean;
}
interface switchSetting {
    type: "switch",
    page: settingPage;
    switches: string[];
    text: string;
    id: string;
    value: string;
    defaultValue: string;
}
interface inputSetting {
    type: "input",
    page: settingPage;
    text: string;
    id: string;
    value: string;
    defaultValue: string;
}
export type setting = booleanSetting | switchSetting | inputSetting;
export interface NXTMetadata extends noIconTool {
    icon: string;
    main: string;
    settings: setting[];
}
