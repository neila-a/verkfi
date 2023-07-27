import I18N from 'react-intl-universal';
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
} from "../components/tools/components";
import Style from "../styles/Index.module.scss";
import LpLogger from "lp-logger";
import {
    getTools,
    tool
} from "../components/tools/info";
import Window, {
    WindowOptions
} from "../components/Window";
import ErrorBoundary from "../components/ErrorBoundary";
import {
    emptyArray
} from "../tools/filter";
import CheckDialog from "../components/dialog/CheckDialog";
import Router from "next/router";
import setSetting from "../components/setting/setSetting";
import useReadSetting from "../components/setting/useReadSetting";
import {
    useRouter
} from "next/router";
import MouseOverPopover from "../components/Popover";
var logger = new LpLogger({
    name: "Index",
    level: "log", // 空字符串时，不显示任何信息
});
import downGo from "../components/arrayMove/downGo";
import upGo from "../components/arrayMove/upGo";
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
    const initialViewMode = useReadSetting("viewmode", "列表模式", "grid");
    var realTools = getTools(I18N),
        [sortedTools, setSortedTools] = useState(realTools),
        [setted, setSetted] = useState<boolean>(false),
        [searchText, setSearchText] = useState<string>(""),
        [viewMode, setViewMode] = useState<"list" | "grid">("grid"),
        [editMode, setEditMode] = useState<boolean>(false),
        [windows, setWindows] = useState<WindowOptions[]>([]),
        [jumpto, setJumpTo] = useState<string>(realTools[11].goto),
        [jumpName, setJumpName] = useState<string>(realTools[11].name),
        [jumpDialogOpen, setJumpDialogOpen] = useState<boolean>(false),
        router = useRouter(),
        [tools, setTools] = useState(sortedTools);
    useEffect(() => {
            setViewMode(initialViewMode);
            setSetted(true);
    }, [initialViewMode]); // 检测lS的viewMode
    useEffect(() => {
        if (setted) setSetting("viewmode", "列表模式", viewMode);
    }, [viewMode]); // 实时保存viewMode至lS
    const {
        query
    } = router;
    /**
     * 搜索工具
     */
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
            empty = realTools.map(tool => (tool.to || tool.goto)),
            value = localStorage.getItem(id);
        switch (value) {
            case null:
                localStorage.setItem(id, JSON.stringify(empty));
                logger.log(`检测到“${name}”为空，已设置为`, empty);
                setSortedTools(realTools);
                break;
            default:
                logger.log(`检测到“${name}”为`, JSON.parse(value));
                const draft = (JSON.parse(value) as string[]).map(toolTo => {
                    var realTool: tool;
                    realTools.forEach(tool => {
                        if (tool.to == toolTo) {
                            realTool = tool;
                        }
                    });
                    return realTool;
                });
                setSortedTools(draft);
                setTools(draft);
                break;
        }
    }, []); // 工具排序
    useEffect(function () {
        if (props.isImplant) {
            setSearchText(props.searchText);
            searchTools(props.searchText);
        } else if (query.searchText) {
            logger.info("query的内容为", query);
            setSearchText(query.searchText as string);
            searchTools(query.searchText as string);
        }
    }, [query]); // 嵌入式检查
    useEffect(() => {
        if (searchText != "") {
            setEditMode(false);
        }
    }, [searchText]); // 自动更新searchText
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
                    <MouseOverPopover text={I18N.get('搜索')}>
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
                    }} placeholder={I18N.get('搜索工具')} inputProps={{
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
                    {tools == emptyArray ? <Typography>{I18N.get('未找到任何工具')}</Typography> : tools.map(tool => { // 遍历tools
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
                                            setSetting("toolslist", "工具列表", JSON.stringify(pd.map(toolp => (tool.to || tool.goto))));
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
                                            setSetting("toolslist", "工具列表", JSON.stringify(pd.map(toolp => (tool.to || tool.goto))));
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
                                        <div className={viewMode == "list" ? Style["singleList"] : ""} onClick={() => {
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
                                                <div className={Style["singleGridIcon"]}>
                                                    <ToolIcon />
                                                </div>
                                                <div>
                                                <Typography variant="h5" component="div">
                                                    <DownButton />
                                                    {tool.goto ? <ExitToAppIcon /> : <></>}
                                                    {tool.name}
                                                    <UpButton />
                                                </Typography>
                                                <Typography variant="body2">
                                                    {tool.desc}
                                                </Typography>
                                                    </div>
                                            </> : <>     
                                                <div className={Style["singleListIcon"]}>
                                                    <ToolIcon />
                                                </div>
                                                <div>
                                                <Typography variant="h5" component="div">
                                                    {tool.goto ? <ExitToAppIcon /> : <></>}
                                                    {tool.name}
                                                </Typography>
                                                <Typography variant="body2">
                                                    <DownButton />{tool.desc}<UpButton />
                                                </Typography>
                                                    </div>
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
                {jumpDialogOpen ? <CheckDialog description={`${I18N.get("确定离开NeilaTools并跳转至")}${jumpName}？`} title={I18N.get('离开NeilaTools')} onTrue={() => {
                    Router.push(jumpto);
                }} onFalse={() => {
                    setJumpDialogOpen(false);
                }} /> : <Fragment /> /* 跳转对话框容器 */}
            </Box>
        </>
    );
};
export default Index;
