"use client";
import React, {
    Fragment,
    useContext,
    useState
} from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography
} from "@mui/material";
import {
    ExitToApp as ExitToAppIcon,
    DragIndicator as DragIndicatorIcon
} from "@mui/icons-material";
import Style from "./Index.module.scss";
import {
    getTools,
    tool
} from "../tools/info";
import {
    useRouter
} from 'next/navigation';
import DownButton from './DownButton';
import UpButton from './UpButton';
import {
    viewMode,
    logger
} from './consts';
import {
    setState
} from '../declare';
import styled from '@emotion/styled';
import dynamic from 'next/dynamic';
const CheckDialog = dynamic(() => import("../components/dialog/CheckDialog"));
import {
    colorMode,
    windows
} from '../layout/layoutClient';
import stringToBoolean from "../setting/stringToBoolean";
import intl, {
    get
} from "react-intl-universal";
export default function SingleTool(props: {
    tool: tool;
    isFirst: boolean;
    darkMode: boolean;
    viewMode: viewMode;
    setTools: setState<tool[]>;
    editMode: boolean;
    sortingFor: string;
}) {
    const {
        tool,
        viewMode,
        editMode,
        setTools,
        sortingFor
    } = props,
        toolsInfo = getTools(get),
        ToolIcon = tool.icon,
        subStyle = {
            sx: {
                color: props.darkMode ? "" : "#999999"
            }
        },
        Router = useRouter(),
        colorContext = useContext(colorMode),
        color = colorContext.value,
        [jumpto, setJumpTo] = useState<string>(""),
        [elevation, setElevation] = useState<number>(2),
        [jumpName, setJumpName] = useState<string>(""),
        [jumpDialogOpen, setJumpDialogOpen] = useState<boolean>(false),
        ToolTypography = styled(Typography)(({
            theme
        }) => ({
            wordBreak: "break-all"
        })),
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
        <Box mb={viewMode === "list" ? 2 : ""} key={tool.to}> {/* 单个工具 */}
            <windows.Consumer>
                {value => (
                    <Card elevation={elevation} sx={{
                        width: viewMode == "grid" ? "275px" : fullWidth,
                        maxWidth: fullWidth,
                        backgroundImage: stringToBoolean(color) ? "linear-gradient(45deg, #" + tool.color[0] + ", #" + tool.color[1] + ")" : ""
                    }} onMouseEnter={event => {
                        setElevation(8);
                    }} onMouseLeave={event => {
                        setElevation(2); // reset to default
                    }}>
                        <CardContent>
                            <div className={viewMode == "list" ? Style["singleList"] : ""} onClick={() => {
                                logger.info(`点击了${tool.name}`);
                                if (tool.isGoto) {
                                    if (tool.to.startsWith("/extendedTools")) {
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
                                    if (tool.to.startsWith("/extendedTools")) {
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
                                    <div className={Style["singleGridIcon"]}>
                                        <ToolIcon />
                                    </div>
                                    <Box>
                                        <ToolTypography variant="h5">
                                            {db}
                                            {(tool.isGoto && !tool.to.startsWith("/extendedTools")) ? <ExitToAppIcon /> : <></>}
                                            {tool.name}
                                            {ub}
                                        </ToolTypography>
                                        <ToolTypography {...subStyle} variant="body2">
                                            {tool.desc}
                                        </ToolTypography>
                                    </Box>
                                </Box> : <>
                                    <div className={Style["singleListText"]}>
                                        <div className={Style["singleListIcon"]}>
                                            <ToolIcon />
                                        </div>
                                        <Box>
                                            <ToolTypography variant="h5">
                                                {(tool.isGoto && !tool.to.startsWith("/extendedTools")) ? <ExitToAppIcon /> : <></>}
                                                {tool.name}
                                            </ToolTypography>
                                            <ToolTypography {...subStyle} variant="body2">
                                                {tool.desc}
                                            </ToolTypography>
                                        </Box>
                                    </div>
                                    <Box>
                                        {editMode && <DragIndicatorIcon />}
                                    </Box>
                                </>}
                            </div>
                            {props.isFirst && <iframe style={{
                                border: "none",
                                width: "100%"
                            }} src={tool.isGoto ? (!tool.to.startsWith("/") ? tool.to : `${tool.to}&only=true`) : `/tools/${tool.to}?only=true`} />}
                        </CardContent>
                    </Card>
                )}
            </windows.Consumer>
            <CheckDialog open={jumpDialogOpen} description={`${get("确定离开verkfi并跳转至")}${jumpName}？`} title={get('离开verkfi')} onTrue={() => {
                Router.push(jumpto);
                setJumpDialogOpen(false);
            }} onFalse={() => {
                setJumpDialogOpen(false);
            }} />
        </Box>
    );
}
