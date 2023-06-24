import HeadBar from "../components/HeadBar";
import React, {
    Fragment,
    useEffect,
    useState
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
    Box
} from "@mui/material";
import {
    Search as SearchIcon,
    ViewModule as ViewModuleIcon,
    ViewList as ViewListIcon,
    ExitToApp as ExitToAppIcon,
    ArrowUpward as ArrowUpwardIcon,
    ArrowDownward as ArrowDownwardIcon,
    Edit as EditIcon,
    EditOff as EditOffIcon
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
    setSetting
} from "../components/useSetting";
import {
    useRouter
} from "next/router";
import MouseOverPopover from "../components/Popover";
export {
    realTools
};
var logger = new LpLogger({
    name: "Index",
    level: "log", // 空字符串时，不显示任何信息
});
export function downGo(fieldData: any[], index: number) {
    if (index != fieldData.length - 1) {
        fieldData[index] = fieldData.splice(index + 1, 1, fieldData[index])[0];
    } else {
        fieldData.unshift(fieldData.splice(index, 1)[0]);
    }
}
export function upGo(fieldData: any[], index: number) {
    if (index != 0) {
        fieldData[index] = fieldData.splice(index - 1, 1, fieldData[index])[0];
    } else {
        fieldData.push(fieldData.shift());
    }
}
export function Index(props: {
    /**
     * 是否为嵌入
     */
    isImplant?: boolean;
    /**
     * 搜索内容
     */
    searchText?: string;
}): JSX.Element {
    var [sortedTools, setSortedTools] = useState(realTools),
        [searchText, setSearchText] = useState<string>(""),
        [viewMode, setViewMode] = useState<"list" | "grid">("grid"),
        [editMode, setEditMode] = useState<boolean>(false),
        [windows, setWindows] = useState<WindowOptions[]>([]),
        [jumpto, setJumpTo] = useState<string>(realTools[11].goto),
        [jumpName, setJumpName] = useState<string>(realTools[11].name),
        [jumpDialogOpen, setJumpDialogOpen] = useState<boolean>(false),
        router = useRouter(),
        [tools, setTools] = useState(sortedTools);
    const {
        query
    } = router;
    function searchTools(search: string) {
        var calcTools: tool[] = [];
        sortedTools.forEach(tool => {
            var to = String(tool.to),
                goto = String(tool.goto);
            if (tool.desc.includes(search) || to.includes(search) || tool.name.includes(search) || goto.includes(search)) calcTools.push(tool);
        });
        setTools(calcTools);
    };
    useEffect(function () {
        { // 打印信息用于调试
            console.groupCollapsed("值信息");
            logger.info(`tools为`, tools);
            logger.info(`searchText为`, searchText);
            logger.info(`viewMode为`, viewMode);
            logger.info(`editMode为`, editMode)
            console.groupEnd();
        }
    }, [
        tools,
        searchText,
        viewMode,
        editMode
    ]);
    useEffect(() => {
        const
            id = "toolslist",
            name = "工具列表",
            empty = realTools.map(tool => tool.name),
            value = localStorage.getItem(id);
        switch (value) {
            case null:
                localStorage.setItem(id, JSON.stringify(empty));
                logger.log(`检测到“${name}”为空，已设置为`, empty);
                setSortedTools(realTools);
                break;
            default:
                logger.log(`检测到“${name}”为`, JSON.parse(value));
                const draft = (JSON.parse(value) as string[]).map(toolName => {
                    var realTool: tool;
                    realTools.forEach(tool => {
                        if (tool.name == toolName) {
                            realTool = tool;
                        }
                    });
                    return realTool;
                });
                setSortedTools(draft);
                setTools(draft);
                break;
        }
    }, [])
    useEffect(function () {
        if (props.isImplant) {
            setSearchText(props.searchText);
            searchTools(props.searchText);
        } else if (query.searchText) {
            logger.info("query的内容为", query);
            setSearchText(query.searchText as string);
            searchTools(query.searchText as string);
        }
    }, [query]);
    useEffect(() => {
        if (searchText != "") {
            setEditMode(false);
        }
    }, [searchText]);
    return (
        <>
            {props.isImplant != true && <HeadBar isIndex pageName="NeilaTools" />}
            <Box sx={{
                p: 3
            }}>
                <Paper sx={{ // 搜索栏
                    p: '2px 4px',
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <MouseOverPopover text="搜索">
                        <IconButton type="button" sx={{
                            p: '10px'
                        }} aria-label="search" onClick={() => {
                            searchTools(searchText);
                        }}>
                            <SearchIcon />
                        </IconButton>
                    </MouseOverPopover>
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
                    <MouseOverPopover text={viewMode == "grid" ? "切换为列表模式" : "切换为网格模式"}>
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
                    </MouseOverPopover>
                    {searchText == "" && <MouseOverPopover text={editMode ? "关闭编辑模式" : "切换编辑模式"}>
                        <IconButton color="primary" sx={{
                            p: '10px'
                        }} aria-label="directions" onClick={event => {
                            switch (editMode) {
                                case true:
                                    setEditMode(false);
                                    break;
                                case false:
                                    setEditMode(true);
                                    break;
                            }
                        }}>
                            {editMode ? <EditOffIcon /> : <EditIcon />}
                        </IconButton>
                    </MouseOverPopover>}
                </Paper>
                <br />
                <Stack spacing={5} className={Style["items"]} sx={{
                    flexDirection: viewMode == "grid" ? "row" : "",
                    display: viewMode == "grid" ? "flex" : "block"
                }}> {/* 工具总览 */}
                    {tools == emptyArray ? <Typography>未找到任何工具</Typography> : tools.map(tool => { // 遍历tools
                        const ToolIcon = tool.icon;
                        function DownButton(): JSX.Element {
                            if (editMode) {
                                return (
                                    <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{
                                        mr: 2
                                    }} onClick={event => {
                                        event.stopPropagation();
                                        setTools(draft => {
                                            var pd = draft.slice(0);
                                            downGo(pd, pd.indexOf(tool));
                                            setSetting("toolslist", "工具列表", JSON.stringify(pd.map(toolp => toolp.name)));
                                            return pd;
                                        });
                                    }}>
                                        <ArrowDownwardIcon />
                                    </IconButton>
                                );
                            } else {
                                return <></>;
                            }
                        }
                        function UpButton(): JSX.Element {
                            if (editMode) {
                                return (
                                    <IconButton size="large" edge="end" color="inherit" aria-label="menu" sx={{
                                        mr: 2
                                    }} onClick={event => {
                                        event.stopPropagation();
                                        setTools(draft => {
                                            var pd = draft.slice(0);
                                            upGo(pd, pd.indexOf(tool));
                                            setSetting("toolslist", "工具列表", JSON.stringify(pd.map(toolp => toolp.name)));
                                            return pd;
                                        });
                                    }}>
                                        <ArrowUpwardIcon />
                                    </IconButton>
                                );
                            } else {
                                return <></>;
                            }
                        }
                        return (
                            <Fragment key={tool.name}> {/* 单个工具 */}
                                <Card sx={viewMode == "grid" ? {
                                    minWidth: 275
                                } : {
                                    minWidth: "100%"
                                }} elevation={10}>
                                    <CardContent>
                                        <div style={{
                                            cursor: "pointer"
                                        }} onClick={() => {
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
                                            {viewMode == "grid" ? <>
                                                <Typography variant="h5" component="div">
                                                    <DownButton />
                                                    <ToolIcon />
                                                    {tool.name}
                                                    {tool.goto ? <ExitToAppIcon /> : <></>}
                                                    <UpButton />
                                                </Typography>
                                                <Typography variant="body2">
                                                    {tool.desc}
                                                </Typography>
                                            </> : <>
                                                <Typography variant="body2">
                                                    <DownButton /><ToolIcon />{tool.name} - {tool.desc}<UpButton />
                                                </Typography>
                                            </>}
                                        </div>
                                    </CardContent>
                                </Card>
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
                }} onFalse={() => {
                    setJumpDialogOpen(false);
                }} /> : <Fragment /> /* 跳转对话框容器 */}
            </Box>
        </>
    );
};
export default Index;