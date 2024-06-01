"use client";
import {
    Delete,
    DragIndicator as DragIndicatorIcon,
    ExitToApp as ExitToAppIcon,
    FolderDelete
} from "@mui/icons-material";
import {
    Box,
    ButtonBase,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Collapse,
    IconButton,
    Typography,
    TypographyOwnProps
} from "@mui/material";
import MouseOverPopover from "@verkfi/shared/Popover";
import {
    useAtom
} from "jotai";
import {
    booleanifyDarkMode,
    gradientTool as gradientToolAtom,
    lists as listsAtom
} from "@verkfi/shared/atoms";
import {
    Route
} from "next";
import dynamic from "next/dynamic";
import {
    useRouter
} from "next/navigation";
import {
    Fragment,
    createElement,
    useContext,
    useState
} from "react";
import {
    get
} from "react-intl-universal";
import {
    NXTMetadata
} from "setting/extensions/page";
import toolsInfoAtom, {
    tool
} from "tools/info";
import DownButton from "../sorting/DownButton";
import UpButton from "../sorting/UpButton";
const CheckDialog = dynamic(() => import("@verkfi/shared/dialog/Check"));
import {
    viewMode as viewModeAtom
} from "@verkfi/shared/atoms";
import {
    editModeAtom,
    sortingForAtom,
    toolsAtom
} from "index/atoms";
import {
    isImplantContext
} from "index/consts";
import openWindow from "./openWindow";
export default function SingleTool(props: {
    tool: tool;
    isFirst: boolean;
    focus?: boolean;
}) {
    const
        {
            tool
        } = props,
        isImplant = useContext(isImplantContext),
        [realTools] = useAtom(toolsInfoAtom),
        [tools] = useAtom(toolsAtom),
        setTools = useAtom(toolsAtom)[1],
        sortingFor = useAtom(sortingForAtom)[0](isImplant),
        [viewMode] = useAtom(viewModeAtom),
        lightMode = useAtom(booleanifyDarkMode),
        ToolIcon = tool.icon,
        subStyle = {
            sx: {
                color: lightMode ? "" : "#999999"
            }
        },
        router = useRouter(),
        [editMode] = useAtom(editModeAtom),
        [lists, setLists] = useAtom(listsAtom),
        [gradientTool] = useAtom(gradientToolAtom),
        [jumpto, setJumpTo] = useState<string>(""),
        [removeDialogOpen, setRemoveDialogOpen] = useState<boolean>(false),
        [elevation, setElevation] = useState<number>(2),
        [jumpName, setJumpName] = useState<string>(""),
        [jumpDialogOpen, setJumpDialogOpen] = useState<boolean>(false),
        ToolTypography = (props: TypographyOwnProps) => <Typography {...props} sx={{
            ...props.sx,
            wordBreak: "break-all"
        }} />,
        fullWidth = `100%`,
        buttonOptions = {
            editMode: editMode,
            tool: tool,
            sortingFor: sortingFor
        },
        iframe = (
            <Collapse in={props.focus} sx={{
                width: "100%",
                ["& .MuiCollapse-wrapperInner"]: {
                    width: "100%"
                }
            }}>
                {!props.focus && (
                    <Box className="iframe-placeholder" sx={{
                        height: "150px"
                    }} />
                )}
                {props.focus && (
                    <iframe style={{
                        border: "none",
                        width: "100%",
                        height: "150px"
                    }} src={tool.isGoto ? (!tool.to.startsWith("/") ? tool.to : `${tool.to}&only=true`) : `/tools/${tool.to}?only=true`} />
                )}
            </Collapse>
        ),
        handleRightClick = async event => {
            event.preventDefault();
            if (tool.isGoto) {
                if (tool.to.startsWith("/tools/extension")) {
                    await openWindow(`${tool.to}&only=true`);
                } else {
                    setJumpDialogOpen(true);
                    setJumpTo(tool.to);
                    setJumpName(tool.name);
                }
            } else {
                await openWindow(`/tools/${tool.to}?only=true`);
            }
        },
        handleClick = event => {
            if (tool.isGoto) {
                if (tool.to.startsWith("/tools/extension")) {
                    router.push(tool.to as Route);
                } else {
                    setJumpDialogOpen(true);
                    setJumpTo(tool.to);
                    setJumpName(tool.name);
                }
            } else {
                router.push(`/tools/${tool.to}` as Route);
            }
        },
        handleMouseEnter = event => {
            if (tool.isGoto) {
                if (tool.to.startsWith("/tools/extension")) {
                    router.prefetch(tool.to as Route);
                }
            } else {
                router.prefetch(`/tools/${tool.to}` as Route);
            }
            setElevation(8);
        },
        handleMouseLeave = event => {
            setElevation(2); // reset to default
        },
        deleteButtons = (
            <>
                {tool.to.startsWith("/tools/extension") && (
                    <>
                        <MouseOverPopover text={get("singleTool.deleteExtension")}>
                            <IconButton onClick={event => {
                                setRemoveDialogOpen(true);
                            }} aria-label={get("singleTool.deleteExtension")}>
                                <Delete />
                            </IconButton>
                        </MouseOverPopover>
                        {createElement(dynamic(() => import("setting/extensions/RemoveExtensionDialog")), {
                            open: removeDialogOpen,
                            reset: () => setRemoveDialogOpen(false),
                            fileInfo: {
                                ...tool,
                                to: tool.to.replace("/tools/extension?tool=", "") as Lowercase<string>,
                                settings: [],
                                main: ""
                            } as unknown as NXTMetadata,
                            files: [],
                            onTrue: () => setTools(`remove ${tool.to}`)
                        })}
                    </>
                )}
                {sortingFor !== "__global__" && sortingFor !== "__home__" && (
                    <MouseOverPopover text={get("singleTool.deleteFromCategory")}>
                        <IconButton onClick={event => {
                            setLists(lists.slice(0).map(list => {
                                if (list[0] === sortingFor) {
                                    return [list[0], list[1].filter(singleTool => singleTool !== tool.to)];
                                }
                                return list;
                            }));
                            setTools(`remove ${tool.to}`);
                        }} aria-label={get("singleTool.deleteFromCategory")}>
                            <FolderDelete />
                        </IconButton>
                    </MouseOverPopover>
                )}
            </>
        ),
        grid = (
            <Card elevation={elevation} id={`toolAbleToSelect-${tool.to}`} onClick={handleClick} onContextMenu={handleRightClick} sx={{
                width: `min(275px, ${fullWidth})`,
                boxShadow: theme => props.focus && `inset 0 0 0 ${theme.spacing(1)} ${theme.palette.primary[theme.palette.mode]}`,
                backgroundColor: !gradientTool && `#${tool.color[0]}`,
                backgroundImage: gradientTool && `linear-gradient(45deg, #${tool.color[0]}, #${tool.color[1]})`
            }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <CardHeader title={(
                    <ToolTypography variant="h5">
                        {(tool.isGoto && !tool.to.startsWith("/tools/extension")) ? <ExitToAppIcon /> : <Fragment />}
                        {tool.name}
                    </ToolTypography>
                )} avatar={(
                    <ToolIcon />
                )} />
                <CardContent>
                    <ToolTypography {...subStyle} variant="subtitle1">
                        {tool.desc}
                    </ToolTypography>
                </CardContent>
                {editMode && (
                    <CardActions sx={{
                        justifyContent: "center",
                        alignItems: "center"
                    }} onClick={event => {
                        event.stopPropagation();
                    }} classes={{
                        root: "singleTool-editControler"
                    }}>
                        <DownButton {...buttonOptions} />
                        <UpButton {...buttonOptions} />
                        {deleteButtons}
                    </CardActions>
                )}
                {props.focus && (
                    <CardContent>
                        {iframe}
                    </CardContent>
                )}
            </Card>
        ),
        list = (
            <Card onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} elevation={elevation} sx={{
                width: fullWidth,
                maxWidth: fullWidth,
                boxShadow: theme => props.focus && `inset 0 0 0 ${theme.spacing(1)} ${theme.palette.primary[theme.palette.mode]}`,
                backgroundColor: !gradientTool && `#${tool.color[0]}`,
                backgroundImage: gradientTool && `linear-gradient(45deg, #${tool.color[0]}, #${tool.color[1]})`
            }} id={`toolAbleToSelect-${tool.to}`} onClick={handleClick} onContextMenu={handleRightClick}>
                <Box sx={{
                    textAlign: "left",
                    position: "relative",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                }}>
                    <Box sx={{
                        textAlign: "left",
                        position: "relative",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center"
                    }}>
                        <CardHeader avatar={(
                            <ToolIcon />
                        )} title={(
                            <ToolTypography variant="h5">
                                {(tool.isGoto && !tool.to.startsWith("/tools/extension")) ? <ExitToAppIcon /> : <Fragment />}
                                {tool.name}
                            </ToolTypography>
                        )} />
                        <CardContent>
                            <Box sx={{
                                display: "flex",
                                alignItems: "center"
                            }}>
                                <ToolTypography {...subStyle} variant="subtitle1">
                                    {tool.desc}
                                </ToolTypography>
                            </Box>
                        </CardContent>
                    </Box>
                    {editMode && (
                        <CardActions onClick={event => {
                            event.stopPropagation();
                        }} classes={{
                            root: "singleTool-editControler"
                        }} sx={{
                            display: "flex",
                            alignItems: "center"
                        }}>
                            {deleteButtons}
                            <DragIndicatorIcon />
                        </CardActions>
                    )}
                </Box>
                {props.focus && (
                    <CardContent>
                        {iframe}
                    </CardContent>
                )}
            </Card>
        );
    return (
        <ButtonBase key={tool.to} component="section" sx={{
            width: viewMode === "grid" ? 275 : fullWidth
        }}>
            {viewMode === "grid" ? grid : list}
            <CheckDialog open={jumpDialogOpen} description={`${get("singleTool.jump")}${jumpName}？`} title={get("离开Verkfi")} onTrue={() => {
                router.push(jumpto as Route);
                setJumpDialogOpen(false);
            }} onFalse={() => {
                setJumpDialogOpen(false);
            }} />
        </ButtonBase>
    );
}