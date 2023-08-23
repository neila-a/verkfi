"use client";
import I18N from 'react-intl-universal';
import HeadBar from "./components/headBar/HeadBar";
import React, {
    Dispatch,
    Fragment,
    SetStateAction,
    useEffect,
    useState
} from 'react';
import {
    Stack,
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
    Edit as EditIcon,
    EditOff as EditOffIcon
} from "@mui/icons-material";
import Style from "./styles/Index.module.scss";
import LpLogger from "lp-logger";
import {
    getTools,
    tool
} from "./tools/info";
import Window, {
    WindowOptions
} from "./components/window/Window";
import ErrorBoundary from "./components/ErrorBoundary";
import {
    emptyArray
} from "./tools/filter/tool";
import CheckDialog from "./components/dialog/CheckDialog";
import {
    useRouter
} from 'next/navigation';
import setSetting from "./setting/setSetting";
import useReadSetting from "./setting/useReadSetting";
import stringToBoolean from "./setting/stringToBoolean";
import MouseOverPopover from "./components/Popover";
export var logger = new LpLogger({
    name: "Index",
    level: "log", // 空字符串时，不显示任何信息
});
import {
    useSearchParams
} from 'next/navigation';
import { SingleTool } from './SingleTool';
export type viewMode = "list" | "grid";
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
    const initialViewMode = useReadSetting("viewmode", "列表模式", "grid") as unknown as viewMode,
        initialDarkMode = useReadSetting("darkmode", "暗色模式", "false"),
        initialColor = useReadSetting("color", "多彩主页", "true"),
        searchParams = useSearchParams(),
        Router = useRouter();
    var realTools = getTools(I18N),
        [color, setColor] = useState<boolean>(true),
        [darkMode, setDarkMode] = useState<boolean>(false),
        [sortedTools, setSortedTools] = useState(realTools),
        [setted, setSetted] = useState<boolean>(false),
        [searchText, setSearchText] = useState<string>(""),
        [viewMode, setViewMode] = useState<viewMode>("grid"),
        [editMode, setEditMode] = useState<boolean>(false),
        [windows, setWindows] = useState<WindowOptions[]>([]),
        [jumpto, setJumpTo] = useState<string>(realTools[11].to),
        [jumpName, setJumpName] = useState<string>(realTools[11].name),
        [jumpDialogOpen, setJumpDialogOpen] = useState<boolean>(false),
        [tools, setTools] = useState(sortedTools);
    useEffect(() => {
        setViewMode(initialViewMode);
        setColor(stringToBoolean(initialColor));
        setDarkMode(stringToBoolean(initialDarkMode));
        setSetted(true);
    }, [initialViewMode, initialDarkMode, initialColor]); // 检测lS的viewMode
    useEffect(() => {
        if (setted) setSetting("viewmode", "列表模式", viewMode);
    }, [viewMode]); // 实时保存viewMode至lS
    /**
     * 搜索工具
     */
    function searchTools(search: string) {
        var calcTools: tool[] = [];
        sortedTools.forEach(tool => {
            var to = String(tool.to);
            if (tool.desc.includes(search) || to.includes(search) || tool.name.includes(search)) calcTools.push(tool);
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
            empty = realTools.map(atool => atool.to),
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
                    realTools.forEach(atool => {
                        if (atool.to == toolTo) {
                            realTool = atool;
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
        } else if (searchParams.has("searchText")) {
            const paramText = searchParams.get("searchText");
            setSearchText(paramText);
            searchTools(paramText);
        }
    }, [searchParams]); // 嵌入式检查
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
                    {tools.length === 0 ? <Typography>{I18N.get('未找到任何工具')}</Typography> : tools.map(tool => (
                        <SingleTool
                            tool={tool}
                            key={tool.to}
                            color={color}
                            darkMode={darkMode}
                            viewMode={viewMode}
                            setTools={setTools}
                            setJumpDialogOpen={setJumpDialogOpen}
                            setJumpName={setJumpName}
                            setJumpTo={setJumpTo}
                            setWindows={setWindows}
                            editMode={editMode}
                            windows={windows}
                        />
                    ))}
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
