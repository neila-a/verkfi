"use client";
import React, {
    Fragment,
    useState
} from 'react';
import {
    Card,
    CardContent,
    Typography
} from "@mui/material";
import {
    ExitToApp as ExitToAppIcon
} from "@mui/icons-material";
import Style from "../styles/Index.module.scss";
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
    windows
} from '../layoutClient';
import stringToBoolean from "../setting/stringToBoolean";
import I18N from "react-intl-universal";
import useStoragedState from '../components/useStoragedState';
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
        toolsInfo = getTools(I18N),
        ToolIcon = tool.icon,
        subStyle = {
            sx: {
                color: props.darkMode ? "" : "#999999"
            }
        },
        Router = useRouter(),
        [color, setColor] = useStoragedState("color", "多彩主页", "true"),
        [jumpto, setJumpTo] = useState<string>(""),
        [jumpName, setJumpName] = useState<string>(""),
        [jumpDialogOpen, setJumpDialogOpen] = useState<boolean>(false),
        ToolTypography = styled(Typography)(({
            theme
        }) => ({
            wordBreak: "break-all",
            color: stringToBoolean(color) ? "#000000" : ""
        }));
    const fullWidth = `100%`,
        buttonOptions = {
            editMode: editMode,
            setTools: setTools,
            tool: tool,
            sortingFor: sortingFor
        };
    return (
        <Fragment key={tool.to}> {/* 单个工具 */}
            <windows.Consumer>
                {value => (
                    <Card sx={{
                        width: viewMode == "grid" ? "275px" : fullWidth,
                        maxWidth: fullWidth,
                        backgroundImage: stringToBoolean(color) ? "linear-gradient(45deg, #" + tool.color[0] + ", #" + tool.color[1] + ")" : ""
                    }} elevation={10}>
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
                                {viewMode == "grid" ? <div>
                                    <div className={Style["singleGridIcon"]}>
                                        <ToolIcon sx={{
                                            color: stringToBoolean(color) ? "#000000" : ""
                                        }} />
                                    </div>
                                    <div>
                                        <ToolTypography variant="h5">
                                            <DownButton {...buttonOptions} />
                                            {(tool.isGoto && !tool.to.startsWith("/extendedTools")) ? <ExitToAppIcon /> : <></>}
                                            {tool.name}
                                            <UpButton {...buttonOptions} />
                                        </ToolTypography>
                                        <ToolTypography {...subStyle} variant="body2">
                                            {tool.desc}
                                        </ToolTypography>
                                    </div>
                                </div> : <>
                                    <div className={Style["singleListText"]}>
                                        <div className={Style["singleListIcon"]}>
                                            <ToolIcon sx={{
                                                color: stringToBoolean(color) ? "#000000" : ""
                                            }} />
                                        </div>
                                        <div>
                                            <ToolTypography variant="h5">
                                                {(tool.isGoto && !tool.to.startsWith("/extendedTools")) ? <ExitToAppIcon /> : <></>}
                                                {tool.name}
                                            </ToolTypography>
                                            <ToolTypography {...subStyle} variant="body2">
                                                {tool.desc}
                                            </ToolTypography>
                                        </div>
                                    </div>
                                    <div>
                                        <DownButton {...buttonOptions} />
                                        <UpButton {...buttonOptions} />
                                    </div>
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
            {
                jumpDialogOpen ? <CheckDialog description={`${I18N.get("确定离开NeilaTools并跳转至")}${jumpName}？`} title={I18N.get('离开NeilaTools')} onTrue={() => {
                    Router.push(jumpto);
                }} onFalse={() => {
                    setJumpDialogOpen(false);
                }} /> : <Fragment /> /* 跳转对话框容器 */
            }
        </Fragment>
    );
}
