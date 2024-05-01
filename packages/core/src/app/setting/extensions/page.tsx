"use client";
import {
    Stack,
    Typography,
    useMediaQuery,
    useTheme
} from "@mui/material";
import {
    Filesystem
} from "@tybys/browser-asar";
import No from "No";
import {
    FilePondFile,
    FilePondServerConfigProps
} from "filepond";
import {
    useAtom
} from "jotai";
import extensionsAtom from "layout/extensionsAtom";
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
import ToolViewer from "./ToolViewer";
const PureDialog = dynamic(() => import("dialog/Pure"));
export type inputTypes = "modify" | "add";
export default function ExtensionManager() {
    const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false),
        [fileArray, setFileArray] = useState<FilePondFile[]>([]),
        [fileInfo, setFileInfo] = useState<NXTMetadata>(emptyNXTMetadata),
        [files, setFiles] = useState<[string, Uint8Array][]>([]),
        [removeDialogOpen, setRemoveDialogOpen] = useState<boolean>(false),
        [modifyDialogOpen, setModifyDialogOpen] = useState<boolean>(false),
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
        [extensionTools] = useAtom(extensionsAtom),
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
            <Stack spacing={2} mb={2}>
                {extensionTools?.length === 0 ? (
                    <No>
                        {get("extensions.未找到任何扩展")}
                    </No>
                ) : extensionTools?.map(single => (
                    <ToolViewer
                        key={single.to}
                        single={single}
                        fileInfo={fileInfo}
                        setFileInfo={setFileInfo}
                        modifyDialogOpen={modifyDialogOpen}
                        setModifyDialogOpen={setModifyDialogOpen}
                        setRemoveDialogOpen={setRemoveDialogOpen}
                        files={files}
                        setFiles={setFiles}
                        reset={reset}
                    />
                ))}
            </Stack>
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
                            main: main.main,
                            settings: "settings" in main ? (main.settings satisfies setting[]).map((settingItem: setting) => ({
                                ...settingItem,
                                value: settingItem.defaultValue
                            })) : []
                        });
                        setFiles(dir.map(item => [item, fs.readFileSync(item)]));
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
