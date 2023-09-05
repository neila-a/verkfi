"use client";
import React, { useState } from 'react';
import {
    Card,
    CardContent,
    Typography
} from "@mui/material";
import {
    ExitToApp as ExitToAppIcon
} from "@mui/icons-material";
import {
    components as ToolComponents
} from "../tools/components";
import Style from "../styles/Index.module.scss";
import {
    tool
} from "../tools/info";
import {
    WindowOptions
} from "../components/window/Window";
import {
    useRouter
} from 'next/navigation';
import DownButton from './DownButton';
import UpButton from './UpButton';
import {
    viewMode,
    logger
} from '../page';
import {
    setState
} from '../declare';
import styled from '@emotion/styled';
import {
    drawerWidth
} from '../setting/page';
import {
    isBrowser,
    windows
} from '../layoutClient';
import stringToBoolean from "../setting/stringToBoolean";
import checkOption from '../setting/checkOption';
export default function SingleTool(props: {
    tool: tool;
    darkMode: boolean;
    viewMode: viewMode;
    setTools: setState<tool[]>;
    editMode: boolean;
    setJumpDialogOpen: setState<boolean>;
    setJumpTo: setState<string>;
    setJumpName: setState<string>;
    sortingFor: string;
}) {
    const {
        tool,
        viewMode,
        editMode,
        setTools,
        setJumpDialogOpen,
        setJumpTo,
        setJumpName,
        sortingFor
    } = props,
        ToolIcon = tool.icon,
        subStyle = {
            sx: {
                color: props.darkMode ? "" : "#999999"
            }
        },
        Router = useRouter(),
        [screenWidth, setScreenWidth] = useState<number>(() => {
            const windowWidth = window.innerWidth;
            return windowWidth || 320;
        }),
        [color, setColor] = useState<boolean>(() => {
            const mode = stringToBoolean(checkOption("color", "多彩主页", "true"));
            if (isBrowser()) {
                return mode;
            }
            return true;
        }),
        ToolTypography = styled(Typography)(({
            theme
        }) => ({
            wordBreak: "break-all",
            color: color ? "#000000" : ""
        }));
    return (
        <div key={tool.to}> {/* 单个工具 */}
            <windows.Consumer>
                {value => (
                    <Card sx={{
                        width: viewMode == "grid" ? 275 : "100%",
                        maxWidth: screenWidth - 24 - drawerWidth,
                        backgroundImage: color ? "linear-gradient(45deg, #" + tool.color[0] + ", #" + tool.color[1] + ")" : ""
                    }} elevation={10}>
                        <CardContent>
                            <div className={viewMode == "list" ? Style["singleList"] : ""} onClick={() => {
                                logger.info(`点击了${tool.name}`);
                                if (tool.isGoto) {
                                    setJumpDialogOpen(true);
                                    setJumpTo(tool.to);
                                    setJumpName(tool.name);
                                } else {
                                    Router.push(`/tool?tool=${tool.to}`);
                                }
                            }} onContextMenu={event => {
                                event.preventDefault();
                                if (tool.isGoto) {
                                    setJumpDialogOpen(true);
                                    setJumpTo(tool.to);
                                    setJumpName(tool.name);
                                } else {
                                    value.set([...value.windows, {
                                        Component: ToolComponents[tool.to],
                                        to: `/tool?tool=${tool.to}`,
                                        name: tool.name,
                                        id: Math.random().toString().replace(/0\./g, "")
                                    }]);
                                }
                            }}>
                                {viewMode == "grid" ? <div>
                                    <div className={Style["singleGridIcon"]}>
                                        <ToolIcon sx={{
                                            color: color ? "#000000" : ""
                                        }} />
                                    </div>
                                    <div>
                                        <ToolTypography variant="h5">
                                            <DownButton editMode={editMode} setTools={setTools} tool={tool} sortingFor={sortingFor} />
                                            {tool.isGoto ? <ExitToAppIcon /> : <></>}
                                            {tool.name}
                                            <UpButton editMode={editMode} setTools={setTools} tool={tool} sortingFor={sortingFor} />
                                        </ToolTypography>
                                        <ToolTypography {...subStyle} variant="body2">
                                            {tool.desc}
                                        </ToolTypography>
                                    </div>
                                </div> : <>
                                    <div className={Style["singleListText"]}>
                                        <div className={Style["singleListIcon"]}>
                                            <ToolIcon sx={{
                                                color: color ? "#000000" : ""
                                            }} />
                                        </div>
                                        <div>
                                            <ToolTypography variant="h5">
                                                {tool.isGoto ? <ExitToAppIcon /> : <></>}
                                                {tool.name}
                                            </ToolTypography>
                                            <ToolTypography {...subStyle} variant="body2">
                                                {tool.desc}
                                            </ToolTypography>
                                        </div>
                                    </div>
                                    <div>
                                        <DownButton editMode={editMode} setTools={setTools} tool={tool} sortingFor={sortingFor} />
                                        <UpButton editMode={editMode} setTools={setTools} tool={tool} sortingFor={sortingFor} />
                                    </div>
                                </>}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </windows.Consumer>
        </div>
    );
}
