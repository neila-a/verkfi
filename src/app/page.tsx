"use client";
import I18N from 'react-intl-universal';
import HeadBar from "./components/headBar/HeadBar";
import {
    useEffect,
    useRef,
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
    Box,
    PaletteMode,
    Drawer,
    Toolbar
} from "@mui/material";
import Style from "./styles/Index.module.scss";
import {
    getTools,
    tool
} from "./tools/info";
import {
    useSearchParams
} from 'next/navigation';
import SingleTool from './index/SingleTool';
import getToolsList from './index/getToolsList';
import Sidebar from './index/Sidebar';
import {
    viewMode,
    logger
} from './index/consts';
import useStoragedState from './components/useStoragedState';
import stringToBoolean from './setting/stringToBoolean';
import { setState } from './declare';
export default function Index(props: {
    /**
     * 是否为嵌入
     */
    isImplant?: boolean;
    /**
     * 搜索内容
     */
    children?: string;
    ref?;
    expand?: boolean;
    setExpand?: setState<boolean>;
}): JSX.Element {
    const searchParams = useSearchParams(),
        /**
         * 包装过的getToolsList
         * @returns 经过排序的工具列表
         */
        wrappedGetToolsList = () => {
            return getToolsList(realTools);
        },
        refThis = useRef();
    const {
        ref = refThis
    } = props;
    var realTools = getTools(I18N),
        [darkModeFormStorage, setDarkModeFormStorage] = useStoragedState<PaletteMode>("darkmode", "暗色模式", "light"),
        [sortedTools, setSortedTools] = useState(wrappedGetToolsList),
        [searchText, setSearchText] = useState<string>(""),
        [viewMode, setViewMode] = useStoragedState<viewMode>("viewmode", "列表模式", "grid"),
        [editMode, setEditMode] = useState<boolean>(false),
        [expandThis, setExpandThis] = useState<boolean>(false),
        [tools, setTools] = useState(wrappedGetToolsList),
        [sortingFor, setSortingFor] = useState<string>("__global__"),
        darkMode = stringToBoolean(darkModeFormStorage.replace("light", "false").replace("dark", "true"));
    if (props.setExpand) {
        var {
            expand,
            setExpand
        } = props;
    } else {
        var expand = expandThis,
            setExpand = setExpandThis;
    }
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
    useEffect(() => {
        if (props.isImplant) {
            setSearchText(props.children);
            searchTools(props.children);
        } else if (searchParams.has("searchText")) {
            const paramText = searchParams.get("searchText");
            setSearchText(paramText);
            searchTools(paramText);
        }
        if (searchText != "") {
            setEditMode(false);
        }
    }, []);
    function Tools() {
        return (
            <Box sx={{
                p: 3,
                marginLeft: props.isImplant ? "" : `${drawerWidth}px`
            }}>
                <Stack spacing={viewMode == "list" ? 3 : 5} className={Style["items"]} sx={{
                    flexDirection: viewMode == "grid" ? "row" : "",
                    display: viewMode == "grid" ? "flex" : "block",
                    width: "100%"
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
        );
    }
    return (
        <div ref={ref}>
            {props.isImplant !== true && <HeadBar isIndex pageName="NeilaTools" sx={{
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
                expand={expand}
                setExpand={setExpand}
            />
            {props.isImplant ? (expand && <Drawer anchor='left' variant="permanent" sx={{
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                    position: "absolute",
                    left: drawerWidth,
                    maxWidth: `calc(100vw - ${drawerWidth}px)`,
                    width: `320px`,
                    boxSizing: 'border-box'
                }
            }}>
                <Toolbar />
                <Tools />
            </Drawer>) : <Tools />}
        </div>
    );
};
