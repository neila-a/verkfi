"use client";
import I18N from 'react-intl-universal';
import HeadBar from "./components/headBar/HeadBar";
import {
    Fragment,
    useEffect,
    useState
} from 'react';
import {
    ThemeHaveZIndex,
    drawerWidth
} from './setting/page';
import {
    Stack,
    Typography,
    Box
} from "@mui/material";
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
import stringToBoolean from "./setting/stringToBoolean";
export var logger = new LpLogger({
    name: "Index",
    level: "log", // 空字符串时，不显示任何信息
});
import {
    useSearchParams
} from 'next/navigation';
import {
    DragDropContext,
    Droppable,
    Draggable
} from "@hello-pangea/dnd";
import SingleTool from './index/SingleTool';
import checkOption from './setting/checkOption';
import getToolsList from './index/getToolsList';
import Sidebar from './index/Sidebar';
import reorder from './components/reorder';
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
    const searchParams = useSearchParams(),
        Router = useRouter();
    /**
     * 包装过的getToolsList
     * @returns 经过排序的工具列表
     */
    const wrappedGetToolsList = () => {
        return getToolsList(realTools);
    }
    var realTools = getTools(I18N),
        [color, setColor] = useState<boolean>(() => {
            const mode = stringToBoolean(checkOption("color", "多彩主页", "true"));
            return mode || true;
        }),
        [darkMode, setDarkMode] = useState<boolean>(() => {
            const mode = stringToBoolean(checkOption("darkmode", "暗色模式", "false"));
            return mode || false;
        }),
        [sortedTools, setSortedTools] = useState(wrappedGetToolsList),
        [searchText, setSearchText] = useState<string>(""),
        [viewMode, setViewMode] = useState<viewMode>(() => {
            const mode = checkOption("viewmode", "列表模式", "grid") as viewMode;
            return mode || "grid";
        }),
        [editMode, setEditMode] = useState<boolean>(false),
        [windows, setWindows] = useState<WindowOptions[]>([]),
        [jumpto, setJumpTo] = useState<string>(realTools[11].to),
        [jumpName, setJumpName] = useState<string>(realTools[11].name),
        [jumpDialogOpen, setJumpDialogOpen] = useState<boolean>(false),
        [tools, setTools] = useState(wrappedGetToolsList),
        [sortingFor, setSortingFor] = useState<string>("__global__");
    useEffect(() => {
        setSetting("viewmode", "列表模式", viewMode);
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
    useEffect(function () {
        if (props.isImplant && props.searchText) {
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
            {props.isImplant != true && <HeadBar isIndex pageName="NeilaTools" sx={{
                zIndex: theme => (theme as ThemeHaveZIndex).zIndex.drawer + 1
            }} />}
            <Sidebar
                isImplant={props.isImplant}
                viewMode={viewMode}
                setViewMode={setViewMode}
                editMode={editMode}
                setEditMode={setEditMode}
                searchText={searchText}
                setSearchText={setSearchText}
                searchTools={searchTools}
                setTools={setTools}
                setSortingFor={setSortingFor}
            />
            <Box sx={{
                p: 3,
                marginLeft: props.isImplant ? "" : `${drawerWidth}px`
            }}>
                <Stack spacing={viewMode == "list" ? 3 : 5} className={Style["items"]} sx={{
                    flexDirection: viewMode == "grid" ? "row" : "",
                    display: viewMode == "grid" ? "flex" : "block"
                }}> {/* 工具总览 */}
                    {tools.length === 0 ? <Typography>{I18N.get('未找到任何工具')}</Typography> : <DragDropContext onDragEnd={result => {
                        if (!result.destination) {
                            return;
                        }
                        if (result.destination.index === result.source.index) {
                            return;
                        }
                        console.log(editMode)
                        if (editMode) {
                            const newTools = reorder(tools, result.source.index, result.destination.index);
                            setTools(newTools);
                        }
                    }}>
                        <Droppable droppableId="toolslist" isDropDisabled={!editMode}>
                            {provided => {
                                return (
                                    <div ref={provided.innerRef} {...provided.droppableProps}>
                                        {tools.map((tool, index) => (
                                            <Draggable draggableId={tool.to} index={index} key={tool.to}>
                                                {provided => (
                                                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                        <SingleTool
                                                            tool={tool}
                                                            sortingFor={sortingFor}
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
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                );
                            }}
                        </Droppable>
                    </DragDropContext>}
                </Stack>
                <ErrorBoundary>
                    {windows == emptyArray ? <Fragment /> : windows.map(window => {
                        return <Window {...window} key={window.id} />
                    })}
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
