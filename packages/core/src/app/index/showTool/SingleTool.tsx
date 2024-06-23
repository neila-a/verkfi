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
    styled,
    useColorScheme
} from "@mui/material";
import MouseOverPopover from "@verkfi/shared/Popover";
import {
    useAtom,
    useAtomValue,
    useSetAtom
} from "jotai";
import {
    gradientToolAtom as gradientToolAtom,
    listsAtom
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
    ReactNode,
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
import {
    tool
} from "tools/info";
import DownButton from "../sorting/DownButton";
import UpButton from "../sorting/UpButton";
const CheckDialog = dynamic(() => import("@verkfi/shared/dialog/Check"));
import {
    viewModeAtom
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
import {
    highElevation,
    lowElevation
} from "@verkfi/tool-pillar/SingleCollocation";
const gridWidth = 275,
    ToolTypography = styled(Typography)({
        wordBreak: "break-all"
    });
export default function SingleTool(props: {
    tool: tool;
    actions?: ReactNode;
    focus?: boolean;
    disableClick?: boolean;
}) {
    const
        {
            tool
        } = props,
        isImplant = useContext(isImplantContext),
        setTools = useSetAtom(toolsAtom),
        sortingFor = useAtomValue(sortingForAtom)(isImplant),
        viewMode = useAtomValue(viewModeAtom),
        lightMode = useColorScheme().systemMode === "light",
        ToolIcon = tool.icon,
        subStyle = {
            sx: {
                color: lightMode ? "" : "#999999"
            }
        },
        router = useRouter(),
        editMode = useAtomValue(editModeAtom),
        [lists, setLists] = useAtom(listsAtom),
        gradientTool = useAtomValue(gradientToolAtom),
        [jumpto, setJumpTo] = useState<string>(""),
        [removeDialogOpen, setRemoveDialogOpen] = useState<boolean>(false),
        [elevation, setElevation] = useState<number>(lowElevation),
        [jumpName, setJumpName] = useState<string>(""),
        [jumpDialogOpen, setJumpDialogOpen] = useState<boolean>(false),
        fullWidth = `100%`,
        buttonOptions = {
            tool: tool,
            sortingFor: sortingFor
        },
        iframe = props.focus && !props?.actions
            && <CardContent>
                <Collapse in={props.focus} sx={{
                    width: "100%",
                    ["& .MuiCollapse-wrapperInner"]: {
                        width: "100%"
                    }
                }}>
                    {!props.focus
                        && <Box className="iframe-placeholder" sx={{
                            height: "150px"
                        }} />
                    }
                    {props.focus
                        && <iframe style={{
                            border: "none",
                            width: "100%",
                            height: "150px"
                        }} src={tool.isGoto ? !tool.to.startsWith("/") ? tool.to : `${tool.to}&only=true` : `/tools/${tool.to}?only=true`} />
                    }
                </Collapse>
            </CardContent>,
        handleRightClick = async event => {
            event.preventDefault();
            if (!props?.disableClick) {
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
            }
        },
        handleClick = event => {
            if (!props?.disableClick) {
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
            }
        },
        handleMouseEnter = event => {
            if (!props?.disableClick) {
                if (tool.isGoto) {
                    if (tool.to.startsWith("/tools/extension")) {
                        router.prefetch(tool.to as Route);
                    }
                } else {
                    router.prefetch(`/tools/${tool.to}` as Route);
                }
            }
            setElevation(highElevation);
        },
        handleMouseLeave = event => {
            setElevation(lowElevation); // reset to default
        },
        deleteButtons
            = <>
                {tool.to.startsWith("/tools/extension")
                    && <>
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
                }
                {sortingFor !== "__global__" && sortingFor !== "__home__"
                    && <MouseOverPopover text={get("singleTool.deleteFromCategory")}>
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
                }
            </>,
        actions = props?.actions
            && <CardActions sx={{
                justifyContent: "center",
                alignItems: "center"
            }} onClick={event => {
                event.stopPropagation();
            }} classes={{
                root: "singleTool-editControler"
            }}>
                {props?.actions}
            </CardActions>,
        grid
            = <Card elevation={elevation} id={`toolAbleToSelect-${tool.to}`} onClick={handleClick} onContextMenu={handleRightClick} sx={{
                width: `min(275px, ${fullWidth})`,
                boxShadow: theme => props.focus && `inset 0 0 0 ${theme.spacing(1)} ${theme.palette.primary[theme.palette.mode]}`,
                backgroundColor: !gradientTool && `#${tool.color[0]}`,
                backgroundImage: gradientTool && `linear-gradient(45deg, #${tool.color[0]}, #${tool.color[1]})`
            }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <CardHeader title={(
                    <ToolTypography variant="h5">
                        {tool.isGoto && !tool.to.startsWith("/tools/extension") ? <ExitToAppIcon /> : <Fragment />}
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
                {editMode
                    && <CardActions sx={{
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
                }
                {actions}
                {iframe}
            </Card>,
        list
            = <Card onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} elevation={elevation} sx={{
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
                                {tool.isGoto && !tool.to.startsWith("/tools/extension") ? <ExitToAppIcon /> : <Fragment />}
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
                    {editMode
                        && <CardActions onClick={event => {
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
                    }
                    {actions}
                </Box>
                {iframe}
            </Card>;
    return (
        <ButtonBase key={tool.to} component="section" sx={{
            width: viewMode === "grid" ? gridWidth : fullWidth
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
