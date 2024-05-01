"use client";
import {
    Edit as EditIcon,
    RestartAlt as RestartAltIcon
} from "@mui/icons-material";
import {
    Box,
    Divider,
    IconButton,
    Paper,
    Stack,
    Typography,
    useMediaQuery,
    useTheme
} from "@mui/material";
import MouseOverPopover from "components/Popover";
import {
    single
} from "db";
import {
    setState
} from "declare";
import dynamic from "next/dynamic";
import {
    get
} from "react-intl-universal";
import DialogButtons from "./DialogButtons";
import DialogInputs from "./DialogInputs";
import useClearExtensionData from "./clearExtensionData";
import {
    NXTMetadata,
    inputTypes
} from "./page";
const PureDialog = dynamic(() => import("dialog/Pure"));
export default function ToolViewer(props: {
    single: single;
    fileInfo: NXTMetadata;
    setFileInfo: setState<NXTMetadata>;
    modifyDialogOpen: boolean;
    setModifyDialogOpen: setState<boolean>;
    setRemoveDialogOpen: setState<boolean>;
    files: [string, Uint8Array][];
    setFiles: setState<[string, Uint8Array][]>;
    reset(): void;
}) {
    const {
        single
    } = props,
        clearExtensionData = useClearExtensionData(),
        theme = useTheme(),
        fullScreen = useMediaQuery(theme.breakpoints.down('sm')),
        packagedDialogInputs = (type: inputTypes) => (
            <DialogInputs
                type={type}
                fileInfo={props.fileInfo}
                setFileInfo={props.setFileInfo}
                files={props.files}
                reset={props.reset}
                setModifyDialogOpen={props.setModifyDialogOpen}
                setRemoveDialogOpen={props.setRemoveDialogOpen}
            />
        );
    return (
        <Paper sx={{
            padding: 2
        }}>
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
                                files: thisFiles, ...metadata
                            } = single;
                            clearExtensionData(metadata, thisFiles);
                        }} aria-label={get("extensions.clear")}>
                            <RestartAltIcon />
                        </IconButton>
                    </MouseOverPopover>
                    <MouseOverPopover text={get("extensions.删除扩展")}>
                        <IconButton onClick={event => {
                            props.setFiles(single.files);
                            props.setFileInfo({
                                ...single
                            });
                            props.setModifyDialogOpen(true);
                        }} aria-label={get("extensions.删除扩展")}>
                            <EditIcon />
                        </IconButton>
                    </MouseOverPopover>
                </Box>
            </Box>
            <PureDialog action={(
                <DialogButtons
                    type="modify"
                    fileInfo={props.fileInfo}
                    setModifyDialogOpen={props.setModifyDialogOpen}
                    setRemoveDialogOpen={props.setRemoveDialogOpen}
                    files={props.files}
                    reset={props.reset}
                />
            )} add={{
                fullScreen: fullScreen
            }} open={props.modifyDialogOpen} onClose={event => {
                props.setModifyDialogOpen(false);
            }} title={get("extensions.编辑扩展")}>
                {packagedDialogInputs("modify")}
            </PureDialog>
        </Paper>
    );
}
