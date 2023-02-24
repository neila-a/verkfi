import Link from "next/link";
import HeadBar from "../components/HeadBar";
import React, {
    Fragment, useEffect, useState
} from 'react';
import {
    Stack,
    Card,
    CardContent,
    Typography,
    Divider,
    IconButton,
    InputBase,
    Paper,
    Input
} from "@mui/material";
import {
    Search as SearchIcon,
    ViewModule as ViewModuleIcon,
    ViewList as ViewListIcon,
    ExitToApp as ExitToAppIcon
} from "@mui/icons-material";
import {
    components as ToolComponents
} from "../components/tools";
import Style from "../styles/Index.module.scss";
import LpLogger from "lp-logger";
import realTools, {
    tool
} from "../components/tools";
import Window, {
    WindowOptions
} from "../components/Window";
import ErrorBoundary from "../components/ErrorBoundary";
import {
    emptyArray
} from "../tools/filter";
import {
    CheckDialog
} from "../components/Dialog";
import Router from "next/router";
import {
    useRouter
} from "next/router";
export {
    realTools
};
export var logger = new LpLogger({
    name: "Index",
    level: "log", // 空字符串时，不显示任何信息
});
export default function Index(): JSX.Element {
    var [tools, setTools] = useState<tool[]>(realTools),
        [searchText, setSearchText] = useState<string>(""),
        [viewMode, setViewMode] = useState<"list" | "grid">("grid"),
        [windows, setWindows] = useState<WindowOptions[]>([]),
        [jumpto, setJumpTo] = useState<string>(realTools[9].goto),
        [jumpName, setJumpName] = useState<string>(realTools[9].name),
        [jumpDialogOpen, setJumpDialogOpen] = useState<boolean>(false),
        router = useRouter();
    const { query } = router;
    function searchTools(search: string) {
        var calcTools: tool[] = [];
        realTools.forEach(tool => {
            var to = String(tool.to),
                goto = String(tool.goto);
            if (tool.desc.includes(search) || to.includes(search) || tool.name.includes(search) || goto.includes(search)) calcTools.push(tool);
        });
        setTools(calcTools);
    };
    useEffect(function () {
        { // 打印信息用于调试
            console.group("值信息");
            logger.info(`tools为`, tools);
            logger.info(`searchText为`, searchText);
            logger.info(`viewMode为`, viewMode);
            console.groupEnd();
        }
    }, [
        tools,
        searchText,
        viewMode
    ]);
    useEffect(function () {
        if (query.searchText) {
            logger.info("query的内容为", query);
            setSearchText(query.searchText as string);
            searchTools(query.searchText as string);
        }
    }, [query]);
    return (
        <>
            <HeadBar isIndex pageName="NeilaTools" />
            <br />
            <Paper sx={{ // 搜索栏
                p: '2px 4px',
                display: 'flex',
                alignItems: 'center'
            }}>
                <IconButton type="button" sx={{
                    p: '10px'
                }} aria-label="search" onClick={() => {
                    searchTools(searchText);
                }}>
                    <SearchIcon />
                </IconButton>
                <InputBase value={searchText} sx={{
                    ml: 1,
                    flex: 1
                }} placeholder="搜索工具" inputProps={{
                    'aria-label': 'searchtools',
                }} onChange={event => {
                    setSearchText(event.target.value);
                    searchTools(event.target.value);
                }} />
                <Divider sx={{
                    height: 28,
                    m: 0.5
                }} orientation="vertical" />
                <IconButton color="primary" sx={{
                    p: '10px'
                }} aria-label="directions" onClick={_event => {
                    switch (viewMode) {
                        case "grid":
                            setViewMode("list");
                            break;
                        case "list":
                            setViewMode("grid");
                            break;
                    };
                }}>
                    {viewMode == "grid" ? <ViewListIcon /> : <ViewModuleIcon />}
                </IconButton>
            </Paper>
            <br />
            <Stack spacing={5} className={Style["items"]} sx={{
                flexDirection: viewMode == "grid" ? "row" : "",
                display: viewMode == "grid" ? "flex" : "block"
            }}> {/* 工具总览 */}
                {tools == emptyArray ? <Typography>未找到任何工具</Typography> : tools.map((tool, _index, _array) => { // 遍历tools
                    const ToolIcon = tool.icon;
                    return (
                        <Fragment key={tool.name}> {/* 单个工具 */}
                            <div className={Style["item"]} onClick={() => {
                                logger.info(`点击了${tool.name}`);
                                if (typeof tool.goto == "undefined") {
                                    Router.push(`/tool?tool=${tool.to}`);
                                } else {
                                    setJumpDialogOpen(true);
                                    setJumpTo(tool.goto);
                                    setJumpName(tool.name);
                                }
                            }} onContextMenu={event => {
                                event.preventDefault();
                                if (tool.goto == undefined) {
                                    setWindows([...windows, {
                                        Component: ToolComponents[tool.to],
                                        to: `/tool?tool=${tool.to}`,
                                        name: tool.name
                                    }]);
                                } else {
                                    setJumpDialogOpen(true);
                                    setJumpTo(tool.goto);
                                    setJumpName(tool.name);
                                }
                            }}>
                                <Card sx={viewMode == "grid" ? {
                                    minWidth: 275
                                } : {
                                    minWidth: "100%"
                                }} elevation={10}>
                                    <CardContent>
                                        {viewMode == "grid" ? <>
                                            <Typography variant="h5" component="div">
                                                <ToolIcon />
                                                {tool.name}
                                                {tool.goto ? <ExitToAppIcon /> : <></>}
                                            </Typography>
                                            <Typography variant="body2">
                                                {tool.desc}
                                            </Typography>
                                        </> : <>
                                            <Typography variant="body2">
                                                <ToolIcon />{tool.name} - {tool.desc}
                                            </Typography>
                                        </>}
                                    </CardContent>
                                </Card>
                            </div>
                            {viewMode == "grid" ? <Fragment /> : <br />}
                        </Fragment>
                    );
                })}
            </Stack>
            <ErrorBoundary>
                {windows == emptyArray ? <Fragment /> : windows.map(window => <Window {...window} key={window.to} />)}
            </ErrorBoundary> {/* 窗口容器 */}
            {jumpDialogOpen ? <CheckDialog description={`确定离开NeilaTools并跳转至${jumpName}吗？`} title="离开NeilaTools" onTrue={() => {
                Router.push(jumpto);
            }} open={true} onFalse={() => {
                setJumpDialogOpen(false);
            }} /> : <Fragment /> /* 跳转对话框容器 */}
        </>
    );
};