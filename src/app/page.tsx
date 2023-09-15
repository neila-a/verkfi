"use client";
import I18N from 'react-intl-universal';
import HeadBar from "./components/headBar/HeadBar";
import {
    Fragment,
    useEffect,
    useState
} from 'react';
import type {
    ThemeHaveZIndex
} from './setting/layout';
import {
    drawerWidth
} from './setting/consts';
import {
    Stack,
    Typography,
    Box
} from "@mui/material";
import Style from "./styles/Index.module.scss";
import {
    getTools,
    tool
} from "./tools/info";
import {
    useRouter
} from 'next/navigation';
import setSetting from "./setting/setSetting";
import stringToBoolean from "./setting/stringToBoolean";
import {
    useSearchParams
} from 'next/navigation';
import SingleTool from './index/SingleTool';
import checkOption from './setting/checkOption';
import getToolsList from './index/getToolsList';
import Sidebar from './index/Sidebar';
import {
    viewMode,
    logger
} from './index/consts';
export default function Index(props: {
    /**
     * 是否为嵌入
     */
    isImplant: boolean;
    /**
     * 搜索内容
     */
    children: string;
}): JSX.Element {
    const searchParams = useSearchParams(),
        /**
         * 包装过的getToolsList
         * @returns 经过排序的工具列表
         */
        wrappedGetToolsList = () => {
            return getToolsList(realTools);
        }
    var realTools = getTools(I18N),
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
    useEffect(() => {
        if (props.isImplant) {
            setSearchText(props.children);
            searchTools(props.children);
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
                    {tools.length === 0 ? <Typography>{I18N.get('未找到任何工具')}</Typography> : tools.map(tool => (
                        <SingleTool
                            tool={tool}
                            sortingFor={sortingFor}
                            key={tool.to}
                            darkMode={darkMode}
                            viewMode={viewMode}
                            setTools={setTools}
                            editMode={editMode}
                        />
                    ))}
                </Stack>
            </Box>
        </>
    );
};
