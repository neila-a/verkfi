"use client";
import {
    Fragment,
    createElement,
    useContext,
    useState
} from 'react';
import {
    Box,
    ButtonBase,
    Card,
    CardContent,
    Collapse,
    IconButton,
    Typography,
    TypographyOwnProps
} from "@mui/material";
import {
    ExitToApp as ExitToAppIcon,
    DragIndicator as DragIndicatorIcon,
    Delete,
    FolderDelete
} from "@mui/icons-material";
import {
    tool
} from "tools/info";
import {
    useRouter
} from 'next/navigation';
import DownButton from './DownButton';
import UpButton from './UpButton';
import {
    viewMode
} from './consts';
import {
    setState
} from 'declare';
import dynamic from 'next/dynamic';
const CheckDialog = dynamic(() => import("dialog/Check"));
import {
    gradientTool as gradientToolContext,
    windows as windowsContext,
    useLightMode,
    lists as listsContext,
} from 'layout/layoutClient';
import {
    get
} from "react-intl-universal";
import MouseOverPopover from 'components/Popover';
import {
    NXTMetadata
} from 'setting/extensions/page';
import {
    Route
} from 'next';
export default function SingleTool(props: {
    tool: tool;
    isFirst: boolean;
    viewMode: viewMode;
    setTools: setState<tool[]>;
    editMode: boolean;
    sortingFor: string;
    focus?: boolean;
}) {
    const {
        tool,
        viewMode,
        editMode,
        setTools,
        sortingFor
    } = props,
        lightMode = useLightMode(),
        ToolIcon = tool.icon,
        subStyle = {
            sx: {
                color: lightMode ? "" : "#999999"
            }
        },
        Router = useRouter(),
        usedLists = useContext(listsContext),
        windows = useContext(windowsContext),
        lists = usedLists.value,
        setLists = usedLists.set,
        gradientTool = useContext(gradientToolContext).value,
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
            setTools: setTools,
            tool: tool,
            sortingFor: sortingFor
        },
        db = <DownButton {...buttonOptions} />,
        ub = <UpButton {...buttonOptions} />;
    return (
        <ButtonBase key={tool.to} component="section" sx={{
            width: viewMode == "grid" ? 275 : fullWidth
        }}>
            <Card elevation={elevation} sx={{
                width: viewMode == "grid" ? 275 : fullWidth,
                maxWidth: fullWidth,
                boxShadow: theme => props.focus && `inset 0 0 0 8px ${theme.palette.primary[theme.palette.mode]}`,
                backgroundColor: !gradientTool && `#${tool.color[0]}`,
                backgroundImage: gradientTool && `linear-gradient(45deg, #${tool.color[0]}, #${tool.color[1]})`
            }} onMouseEnter={event => {
                if (tool.isGoto) {
                    if (tool.to.startsWith("/tools/extension")) {
                        Router.prefetch(tool.to as Route);
                    }
                } else {
                    Router.prefetch(`/tools/${tool.to}` as Route);
                }
                setElevation(8);
            }} onMouseLeave={event => {
                setElevation(2); // reset to default
            }}>
                <CardContent>
                    <Box id={`toolAbleToSelect-${tool.to}`} sx={{
                        ...(viewMode === "list" ? {
                            textAlign: "left",
                            position: "relative",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between"
                        } : {})
                    }} onClick={() => {
                        if (tool.isGoto) {
                            if (tool.to.startsWith("/tools/extension")) {
                                Router.push(tool.to as Route);
                            } else {
                                setJumpDialogOpen(true);
                                setJumpTo(tool.to);
                                setJumpName(tool.name);
                            }
                        } else {
                            Router.push(`/tools/${tool.to}` as Route);
                        }
                    }} onContextMenu={async event => {
                        event.preventDefault();
                        if (tool.isGoto) {
                            if (tool.to.startsWith("/tools/extension")) {
                                windows.set([...windows.windows, {
                                    page: `${tool.to}&only=true`,
                                    to: tool.to,
                                    name: tool.name,
                                    color: tool.color,
                                    id: Math.random().toString().replace(/0\./g, "")
                                }]);
                            } else {
                                setJumpDialogOpen(true);
                                setJumpTo(tool.to);
                                setJumpName(tool.name);
                            }
                        } else {
                            windows.set([...windows.windows, {
                                page: `/tools/${tool.to}?only=true`,
                                to: `/tools/${tool.to}`,
                                color: tool.color,
                                name: tool.name,
                                id: Math.random().toString().replace(/0\./g, "")
                            }]);
                        }
                    }}>
                        {viewMode == "grid" ? (
                            <Box>
                                <Box>
                                    <ToolIcon />
                                </Box>
                                <Box>
                                    <ToolTypography variant="h5">
                                        {db}
                                        {(tool.isGoto && !tool.to.startsWith("/tools/extension")) ? <ExitToAppIcon /> : <Fragment />}
                                        {tool.name}
                                        {ub}
                                    </ToolTypography>
                                    <ToolTypography {...subStyle} variant="body2">
                                        {tool.desc}
                                    </ToolTypography>
                                </Box>
                            </Box>
                        ) : (
                            <>
                                <Box sx={{
                                    display: "flex",
                                    alignItems: "center"
                                }}>
                                    <Box sx={{
                                        mr: 2
                                    }}>
                                        <ToolIcon />
                                    </Box>
                                    <Box>
                                        <ToolTypography variant="h5">
                                            {(tool.isGoto && !tool.to.startsWith("/tools/extension")) ? <ExitToAppIcon /> : <Fragment />}
                                            {tool.name}
                                        </ToolTypography>
                                        <ToolTypography {...subStyle} variant="body2">
                                            {tool.desc}
                                        </ToolTypography>
                                    </Box>
                                </Box>
                                {editMode && (
                                    <Box onClick={event => {
                                        event.stopPropagation();
                                    }} className="singleTool-editControler" sx={{
                                        display: "flex",
                                        alignItems: "center"
                                    }}>
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
                                                    onTrue: () => setTools(old => old.slice(0).filter(atool => atool.to !== tool.to))
                                                })}
                                            </>
                                        )}
                                        {sortingFor !== "__global__" && sortingFor !== "__home__" && (
                                            <MouseOverPopover text={get("singleTool.deleteFromCategory")}>
                                                <IconButton onClick={event => {
                                                    setLists(lists.slice(0).map(list => {
                                                        if (list[0] === sortingFor) {
                                                            return [list[0], list[1].filter(singleTool => singleTool !== tool.to)]
                                                        }
                                                        return list;
                                                    }));
                                                    setTools(old => old.slice(0).filter(atool => atool.to !== tool.to))
                                                }} aria-label={get("singleTool.deleteFromCategory")}>
                                                    <FolderDelete />
                                                </IconButton>
                                            </MouseOverPopover>
                                        )}
                                        <DragIndicatorIcon />
                                    </Box>
                                )}
                            </>
                        )}
                    </Box>
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
                                height: "150px",
                                //transition: "height 0.225s ease-out" // 0.225s = 225ms = https://www.mdui.org/design/motion/duration-easing.html#duration-easing-dynamic-durations
                            }} src={tool.isGoto ? (!tool.to.startsWith("/") ? tool.to : `${tool.to}&only=true`) : `/tools/${tool.to}?only=true`} />
                        )}
                    </Collapse>
                </CardContent>
            </Card>
            <CheckDialog open={jumpDialogOpen} description={`${get("singleTool.jump")}${jumpName}？`} title={get('离开Verkfi')} onTrue={() => {
                Router.push(jumpto as Route);
                setJumpDialogOpen(false);
            }} onFalse={() => {
                setJumpDialogOpen(false);
            }} />
        </ButtonBase>
    );
}
