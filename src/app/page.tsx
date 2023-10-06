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
    Toolbar,
    Paper
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
    viewMode
} from './index/consts';
import useStoragedState from './components/useStoragedState';
import stringToBoolean from './setting/stringToBoolean';
import {
    setState
} from './declare';
import Center from './components/center/Center';
import {
    Handyman as HandymanIcon
} from '@mui/icons-material';
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
        [recentlyUsed, setRecentlyUsed] = useStoragedState<string>("recently-tools", "最近使用的工具", "[]"),
        [sortedTools, setSortedTools] = useState(wrappedGetToolsList),
        [searchText, setSearchText] = useState<string>(""),
        [viewMode, setViewMode] = useStoragedState<viewMode>("viewmode", "列表模式", "grid"),
        [editMode, setEditMode] = useState<boolean>(false),
        [expandThis, setExpandThis] = useState<boolean>(false),
        [tools, setTools] = useState(wrappedGetToolsList),
        [sortingFor, setSortingFor] = useState<string>(props.isImplant ? "__global__" : "__home__"),
        [show, setShow] = useState<"tools" | "home">(props.isImplant ? "tools" : "home"),
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
        setExpand(true);
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
    function ToolsStack(props: {
        paramTool: tool[];
    }) {
        return (
            <Stack spacing={viewMode == "list" ? 3 : 5} className={Style["items"]} sx={{
                flexDirection: viewMode == "grid" ? "row" : "",
                display: viewMode == "grid" ? "flex" : "block",
                width: "100%"
            }}> {/* 工具总览 */}
                {tools.length === 0 ? <Typography>{I18N.get('未找到任何工具')}</Typography> : props.paramTool.map((tool, index) => (
                    <SingleTool
                        isFirst={(searchText !== "") && (index === 0)}
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
        );
    }
    function Tools() {
        return (
            <Box sx={{
                p: 3,
                marginLeft: props.isImplant ? "" : `${drawerWidth}px`
            }}>
                <ToolsStack paramTool={tools} />
            </Box>
        );
    }
    return (
        <div ref={ref}>
            {props.isImplant !== true && <HeadBar isIndex pageName="NeilaTools" sx={{
                zIndex: theme => (theme as ThemeHaveZIndex).zIndex.drawer + 1
            }} />}
            <Sidebar
                setShow={setShow}
                isImplant={props.isImplant}
                viewMode={viewMode}
                setViewMode={setViewMode}
                editMode={editMode}
                setEditMode={setEditMode}
                searchText={searchText}
                setSearchText={setSearchText}
                searchTools={searchTools}
                setTools={setTools}
                setSortedTools={setSortedTools}
                sortingFor={sortingFor}
                setSortingFor={setSortingFor}
                expand={expand}
                setExpand={setExpand}
            />
            {show === "tools" ? (props.isImplant ? (
                expand && <Drawer anchor='left' variant="permanent" sx={{
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
                </Drawer>
            ) : <Tools />) : (
                <Box sx={{
                    p: 3,
                    marginLeft: props.isImplant ? "" : `${drawerWidth}px`
                }}>
                    <Box sx={{
                        paddingBottom: 3,
                        width: "100%"
                    }}>
                        <Center>
                            <HandymanIcon sx={{
                                fontSize: "1000%"
                            }} />
                        </Center>
                    </Box>
                    <Box>
                        <Paper sx={{
                            p: 3
                        }}>
                            <Typography variant='h4'>
                                {I18N.get('最近使用')}
                            </Typography>
                            <ToolsStack paramTool={(JSON.parse(recentlyUsed) as string[]).map(to => {
                                var tool: tool;
                                realTools.forEach(single => {
                                    if (single.to === to) {
                                        tool = single;
                                    }
                                });
                                return tool;
                            })} />
                        </Paper>
                    </Box>
                </Box>
            )}
        </div>
    );
};
