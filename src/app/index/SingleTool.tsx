"use client";
import {
    useContext,
    useState
} from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TypographyOwnProps
} from "@mui/material";
import {
    ExitToApp as ExitToAppIcon,
    DragIndicator as DragIndicatorIcon
} from "@mui/icons-material";
import {
    tool
} from "../tools/info";
import {
    useRouter
} from 'next/navigation';
import DownButton from './DownButton';
import UpButton from './UpButton';
import {
    viewMode,
    logger,
    homeWhere as homeWhereContext
} from './consts';
import {
    setState
} from '../declare';
import dynamic from 'next/dynamic';
const CheckDialog = dynamic(() => import("../components/dialog/CheckDialog"));
import {
    colorMode,
    windows,
    recentlyUsed as recentlyUsedContext,
    mostUsed as mostUsedContext,
    useLightMode,
} from '../layout/layoutClient';
import stringToBoolean from "../setting/stringToBoolean";
import {
    useSwipeable
} from "react-swipeable";
import {
    get
} from "react-intl-universal";
import destroyer from '../components/destroyer';
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
        colorContext = useContext(colorMode),
        recentlyUsed = useContext(recentlyUsedContext),
        mostUsed = useContext(mostUsedContext),
        color = colorContext.value,
        [jumpto, setJumpTo] = useState<string>(""),
        homeWhere = useContext(homeWhereContext),
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
        swipeHandler = useSwipeable({
            onSwipedRight: data => {
                switch (homeWhere) {
                    case "most": {
                        let old = mostUsed.value;
                        Reflect.deleteProperty(old, tool.to);
                        mostUsed.set(old);
                        break;
                    }
                    case "recently": {
                        let old = recentlyUsed.value;
                        recentlyUsed.set(destroyer(old, tool.to));
                        break;
                    }
                }
            }
        }),
        db = <DownButton {...buttonOptions} />,
        ub = <UpButton {...buttonOptions} />;
    return (
        <Box mb={viewMode === "list" && 2} key={tool.to} {...swipeHandler} component="section"> {/* 单个工具 */}
            <windows.Consumer>
                {value => (
                    <Card elevation={elevation} sx={{
                        width: viewMode == "grid" ? 275 : fullWidth,
                        maxWidth: fullWidth,
                        boxShadow: theme => props.focus && `inset 0 0 0 3px ${theme.palette.primary[theme.palette.mode]}`,
                        backgroundImage: color && `linear-gradient(45deg, #${tool.color[0]}, #${tool.color[1]})`
                    }} onMouseEnter={event => {
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
                                logger.info(`点击了${tool.name}`);
                                if (tool.isGoto) {
                                    if (tool.to.startsWith("/tools/extension")) {
                                        Router.push(tool.to);
                                    } else {
                                        setJumpDialogOpen(true);
                                        setJumpTo(tool.to);
                                        setJumpName(tool.name);
                                    }
                                } else {
                                    Router.push(`/tools/${tool.to}`);
                                }
                            }} onContextMenu={async event => {
                                event.preventDefault();
                                if (tool.isGoto) {
                                    if (tool.to.startsWith("/tools/extension")) {
                                        value.set([...value.windows, {
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
                                    value.set([...value.windows, {
                                        page: `/tools/${tool.to}?only=true`,
                                        to: `/tools/${tool.to}`,
                                        color: tool.color,
                                        name: tool.name,
                                        id: Math.random().toString().replace(/0\./g, "")
                                    }]);
                                }
                            }}>
                                {viewMode == "grid" ? <Box>
                                    <Box>
                                        <ToolIcon />
                                    </Box>
                                    <Box>
                                        <ToolTypography variant="h5">
                                            {db}
                                            {(tool.isGoto && !tool.to.startsWith("/tools/extension")) ? <ExitToAppIcon /> : <></>}
                                            {tool.name}
                                            {ub}
                                        </ToolTypography>
                                        <ToolTypography {...subStyle} variant="body2">
                                            {tool.desc}
                                        </ToolTypography>
                                    </Box>
                                </Box> : <>
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
                                                {(tool.isGoto && !tool.to.startsWith("/tools/extension")) ? <ExitToAppIcon /> : <></>}
                                                {tool.name}
                                            </ToolTypography>
                                            <ToolTypography {...subStyle} variant="body2">
                                                {tool.desc}
                                            </ToolTypography>
                                        </Box>
                                    </Box>
                                    <Box>
                                        {editMode && <DragIndicatorIcon />}
                                    </Box>
                                </>}
                            </Box>
                            {props.focus && <iframe style={{
                                border: "none",
                                width: "100%"
                            }} src={tool.isGoto ? (!tool.to.startsWith("/") ? tool.to : `${tool.to}&only=true`) : `/tools/${tool.to}?only=true`} />}
                        </CardContent>
                    </Card>
                )}
            </windows.Consumer>
            <CheckDialog open={jumpDialogOpen} description={`${get("确定离开Verkfi并跳转至")}${jumpName}？`} title={get('离开Verkfi')} onTrue={() => {
                Router.push(jumpto);
                setJumpDialogOpen(false);
            }} onFalse={() => {
                setJumpDialogOpen(false);
            }} />
        </Box>
    );
}
