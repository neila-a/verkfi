"use client";
import intl, {
    get
} from 'react-intl-universal';
import HeadBar from "./components/headBar/HeadBar";
import {
    useContext,
    useEffect,
    useMemo,
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
    Paper,
    Collapse
} from "@mui/material";
import {
    getTools,
    tool
} from "./tools/info";
import {
    useRouter,
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
    first as firstContext,
    showSidebar as showSidebarContext
} from './layout/layoutClient';
import stringToBoolean from './setting/stringToBoolean';
import getParamTools from './index/getParamTools';
import { not } from './components/TransferList';
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
    const realTools = getTools(get),
        searchParams = useSearchParams(),
        router = useRouter(),
        toolsList = useMemo(() => getToolsList(realTools), []),
        refThis = useRef(),
        {
            ref = refThis
        } = props,
        showSidebar = useContext(showSidebarContext),
        first = useContext(firstContext),
        [recentlyUsed, setRecentlyUsed] = useStoragedState<string>("recently-tools", "最近使用的工具", "[]"),
        [mostUsed, setMostUsed] = useStoragedState<string>("most-tools", "最常使用的工具", "{}"),
        [sortedTools, setSortedTools] = useState(toolsList),
        [searchText, setSearchText] = useState<string>(""),
        [viewMode, setViewMode] = useStoragedState<viewMode>("viewmode", "列表模式", "list"),
        [editMode, setEditMode] = useState<boolean>(false),
        [expandThis, setExpandThis] = useState<boolean>(false),
        [showTries, setShowTries] = useState<boolean>(false),
        [tools, setTools] = useState(toolsList),
        [show, setShow] = useState<"tools" | "home">(props.isImplant ? "tools" : "home"),
        tries = useMemo(() => {
            const unUsed = not(realTools.map(single => single.to), Object.keys(JSON.parse(mostUsed))).slice(0, 3),
                isUnFull = unUsed.length < 3, // 判断没用过的工具有没有三个
                toFill = (Object.entries(JSON.parse(mostUsed)) as [string, number][]).sort((r, g) => {
                    if (r[1] < g[1]) {
                        return -1;
                    } if (r[1] > g[1]) {
                        return 1;
                    }
                    return 0;
                }).map(single => single[0]).slice(0, 3 - unUsed.length);// 如果没用过的工具连三个都没有，那么就从使用最少的工具里选几个
            return (isUnFull ? unUsed : unUsed.concat(toFill)).map(to => {
                var tool: tool;
                realTools.forEach(single => {
                    if (single.to === to) {
                        tool = single;
                    }
                });
                return tool;
            });
        }, [mostUsed]),
        [sortingFor, setSortingFor] = useState<string>(props.isImplant ? "__global__" : "__home__");
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
        if (stringToBoolean(first.value)) {
            router.push("/first");
        }
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
            {props.isImplant !== true && <HeadBar isIndex pageName="Verkfi" sx={{
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
                            <HandymanIcon onClick={event => {
                                setShowTries(old => !old);
                            }} sx={{
                                fontSize: "1000%",
                                cursor: "pointer"
                            }} />
                        </Center>
                    </Box>
                    <Collapse in={showTries}>
                        <Box>
                            <Typography variant='h4'>
                                {get('index.trythese')}
                            </Typography>
                            <Box sx={{
                                p: 1
                            }}>
                                <ToolsStack
                                    viewMode={viewMode}
                                    searchText=""
                                    sortingFor={sortingFor}
                                    setTools={setTools}
                                    editMode={false}
                                    paramTool={tries} />
                            </Box>
                        </Box>
                    </Collapse>
                    <Box>
                        <Typography variant='h4'>
                            {get('最近使用')}
                        </Typography>
                        <Box sx={{
                            p: 1
                        }}>
                            <ToolsStack
                                viewMode={viewMode}
                                searchText=""
                                sortingFor={sortingFor}
                                setTools={setTools}
                                editMode={false}
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
                    </Box>
                    <Box>
                        <Typography variant='h4'>
                            {get('最常使用')}
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
                                paramTool={getParamTools(mostUsed, realTools)} />
                        </Box>
                    </Box>
                </Box>
            )}
        </div>
    );
};
