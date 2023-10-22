"use client";
import I18N from 'react-intl-universal';
import HeadBar from "./components/headBar/HeadBar";
import {
    useContext,
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
    Typography,
    Box,
    PaletteMode,
    Drawer,
    Toolbar,
    Paper
} from "@mui/material";
import {
    getTools,
    tool
} from "./tools/info";
import {
    useSearchParams
} from 'next/navigation';
import getToolsList from './index/getToolsList';
import Sidebar from './index/Sidebar';
import {
    viewMode
} from './index/consts';
import useStoragedState from './components/useStoragedState';
import {
    setState
} from './declare';
import Center from './components/center/Center';
import {
    Handyman as HandymanIcon
} from '@mui/icons-material';
import ToolsStack from './index/ToolsStack';
import searchBase from './index/searchBase';
import {
    showSidebar as showSidebarContext
} from './layoutClient';
import stringToBoolean from './setting/stringToBoolean';
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
         * @returns 经过排序的分类
         */
        wrappedGetToolsList = () => {
            return getToolsList(realTools);
        },
        refThis = useRef();
    const {
        ref = refThis
    } = props;
    var realTools = getTools(I18N),
        showSidebar = useContext(showSidebarContext),
        [recentlyUsed, setRecentlyUsed] = useStoragedState<string>("recently-tools", "最近使用的工具", "[]"),
        [mostUsed, setMostUsed] = useStoragedState<string>("most-tools", "最常使用的工具", "{}"),
        [sortedTools, setSortedTools] = useState(wrappedGetToolsList),
        [searchText, setSearchText] = useState<string>(""),
        [viewMode, setViewMode] = useStoragedState<viewMode>("viewmode", "列表模式", "grid"),
        [editMode, setEditMode] = useState<boolean>(false),
        [expandThis, setExpandThis] = useState<boolean>(false),
        [tools, setTools] = useState(wrappedGetToolsList),
        [sortingFor, setSortingFor] = useState<string>(props.isImplant ? "__global__" : "__home__"),
        [show, setShow] = useState<"tools" | "home">(props.isImplant ? "tools" : "home");
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
        setTools(searchBase(sortedTools, search));
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
    function Tools() {
        return (
            <Box sx={{
                p: 3,
                ml: props.isImplant ? "" : `${drawerWidth}px`
            }}>
                <ToolsStack
                    paramTool={tools}
                    viewMode={viewMode}
                    searchText={searchText}
                    sortingFor={sortingFor}
                    setTools={setTools}
                    editMode={editMode}
                />
            </Box>
        );
    }
    return (props.isImplant ? (stringToBoolean(showSidebar.show)) : true) && (
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
                    ml: props.isImplant ? "" : `${drawerWidth}px`
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
                        <Typography variant='h4'>
                            {I18N.get('最近使用')}
                        </Typography>
                        <ToolsStack
                            viewMode={viewMode}
                            searchText=""
                            sortingFor={sortingFor}
                            setTools={setTools}
                            editMode={editMode}
                            paramTool={(JSON.parse(recentlyUsed) as string[]).map(to => {
                                var tool: tool;
                                realTools.forEach(single => {
                                    if (single.to === to) {
                                        tool = single;
                                    }
                                });
                                return tool;
                            })} />
                    </Box>
                    <Box>
                        <Typography variant='h4'>
                            {I18N.get('最常使用')}
                        </Typography>
                        <Box sx={{
                            p: 1
                        }}>
                            <ToolsStack
                                viewMode={viewMode}
                                searchText=""
                                sortingFor={"__home__"}
                                setTools={setTools}
                                editMode={false}
                                paramTool={(Object.entries(JSON.parse(mostUsed)) as [string, number][]).sort((r, g) => {
                                    if (r[1] < g[1]) {
                                        return 1;
                                    } if (r[1] > g[1]) {
                                        return -1;
                                    }
                                    return 0;
                                }).slice(0, 3).map(item => {
                                    const to = item[0];
                                    var tool: tool;
                                    realTools.forEach(single => {
                                        if (single.to === to) {
                                            tool = single;
                                        }
                                    });
                                    return tool;
                                })} />
                        </Box>
                    </Box>
                </Box>
            )}
        </div>
    );
};
