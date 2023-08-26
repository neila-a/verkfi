"use client";
import React from 'react';
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
} from "./tools/components";
import Style from "./styles/Index.module.scss";
import {
    tool
} from "./tools/info";
import {
    WindowOptions
} from "./components/window/Window";
import {
    useRouter
} from 'next/navigation';
import {
    DownButton
} from './DownButton';
import {
    UpButton
} from './UpButton';
import {
    viewMode,
    logger
} from './page';
import {
    setState
} from './declare';
export function SingleTool(props: {
    tool: tool;
    color: boolean;
    darkMode: boolean;
    viewMode: viewMode;
    setTools: setState<tool[]>;
    editMode: boolean;
    setJumpDialogOpen: setState<boolean>;
    setJumpTo: setState<string>;
    setJumpName: setState<string>;
    setWindows: setState<WindowOptions[]>;
    windows: WindowOptions[];
}) {
    const {
        tool, viewMode, editMode, color, setTools, setJumpDialogOpen, setJumpTo, setJumpName, setWindows, windows
    } = props, ToolIcon = tool.icon, subStyle = {
        sx: {
            color: props.darkMode ? "" : "#999999"
        }
    }, Router = useRouter();
    return (
        <div key={tool.to}> {/* 单个工具 */}
            <Card sx={{
                minWidth: viewMode == "grid" ? 275 : "100%",
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
                            setWindows([...windows, {
                                Component: ToolComponents[tool.to],
                                to: `/tool?tool=${tool.to}`,
                                name: tool.name,
                                id: Math.random().toString().replace(/0\./g, "")
                            }]);
                        }
                    }}>
                        {viewMode == "grid" ? <div>
                            <div className={Style["singleGridIcon"]}>
                                <ToolIcon />
                            </div>
                            <div>
                                <Typography variant="h5" component="div">
                                    <DownButton editMode={editMode} setTools={setTools} tool={tool} />
                                    {tool.isGoto ? <ExitToAppIcon /> : <></>}
                                    {tool.name}
                                    <UpButton editMode={editMode} setTools={setTools} tool={tool} />
                                </Typography>
                                <Typography {...subStyle} variant="body2">
                                    {tool.desc}
                                </Typography>
                            </div>
                        </div> : <div className={Style["singleList"]}>
                            <div className={Style["singleListIcon"]}>
                                <ToolIcon />
                            </div>
                            <div>
                                <Typography variant="h5" component="div">
                                    {tool.isGoto ? <ExitToAppIcon /> : <></>}
                                    {tool.name}
                                </Typography>
                                <Typography {...subStyle} variant="body2">
                                    {tool.desc}
                                </Typography>
                            </div>
                            <div>
                                <DownButton editMode={editMode} setTools={setTools} tool={tool} />
                                <UpButton editMode={editMode} setTools={setTools} tool={tool} />
                            </div>
                        </div>}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
