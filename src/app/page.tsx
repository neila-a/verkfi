"use client";
import {
    get
} from 'react-intl-universal';
import HeadBar from "components/HeadBar";
import {
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import type {
    ThemeHaveZIndex
} from 'setting/layout';
import {
    drawerWidth
} from 'setting/consts';
import {
    Typography,
    Box,
    Drawer,
    Toolbar,
    Collapse,
    IconButton
} from "@mui/material";
import {
    getTools,
    tool
} from "tools/info";
import {
    useRouter,
    useSearchParams
} from 'next/navigation';
import useToolsList from 'index/getToolsList';
import Sidebar from 'index/Sidebar';
import {
    viewMode,
    homeWhere
} from 'index/consts';
import useStoragedState from 'useStoragedState';
import {
    setState
} from 'declare';
import ToolsStack from 'index/ToolsStack';
import searchBase from 'index/searchBase';
import {
    first as firstContext,
    recentlyUsed as recentlyUsedContext,
    mostUsed as mostUsedContext,
    showSidebar as showSidebarContext
} from 'layout/layoutClient';
import getParamTools from 'index/getParamTools';
import VerkfiIcon from 'components/verkfiIcon/verkfiIcon';
import generateTries from 'index/generateTries';
import db, {
    single
} from 'db';
import {
    useLiveQuery
} from 'dexie-react-hooks';
import convertExtensionTools from 'index/convertExtensionTools';
import MouseOverPopover from 'components/Popover';
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
        extensionTools = useLiveQuery(() => db.extensionTools.toArray(), [], [] as single[]),
        router = useRouter(),
        toolsList = useToolsList(realTools),
        refThis = useRef(),
        {
            ref = refThis
        } = props,
        showSidebar = useContext(showSidebarContext),
        first = useContext(firstContext),
        recentlyUsed = useContext(recentlyUsedContext).value,
        mostUsed = useContext(mostUsedContext).value,
        [sortedTools, setSortedTools] = useState(toolsList),
        [searchText, setSearchText] = useState<string>(""),
        [viewMode, setViewMode] = useStoragedState<viewMode>("viewmode", "列表模式", "list"),
        [editMode, setEditMode] = useState<boolean>(false),
        [expandThis, setExpandThis] = useState<boolean>(false),
        [showTries, setShowTries] = useState<boolean>(false),
        [tools, setTools] = useState(toolsList),
        [tab, setTab] = useState<number>(0),
        focusingTo = tools[tab] ? tools[tab].to : "", // 每次渲染会重新执行
        [show, setShow] = useState<"tools" | "home">(props.isImplant ? "tools" : "home"),
        tries = useMemo(() => generateTries(mostUsed, realTools), [mostUsed, realTools]),
        recentlyTools = recentlyUsed.map(to => {
            const converted = convertExtensionTools(extensionTools);
            var tool: tool | 0 = 0
                || realTools.find(single => single.to === to)
                || converted.find(single => `/tools/extension?tool=${to}` === single.to);
            return tool;
        }).filter((item: tool | 0) => item !== 0) as unknown as tool[],
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
    useEffect(() => {
        if ("setted" in window) {
            if (window.setted.first && first.value) {
                router.push("/first");
            }
        }
    }, [first]);
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
                    focus={focusingTo}
                />
            </Box>
        );
    }
    return (props.isImplant ? showSidebar.show : true) && (
        <Box ref={ref}>
            {props.isImplant !== true && (
                <HeadBar isIndex pageName="Verkfi" sx={{
                    zIndex: theme => String((theme as ThemeHaveZIndex).zIndex.drawer + 1)
                }} />
            )}
            <Sidebar
                tools={tools}
                focusingTo={focusingTo}
                setTab={setTab}
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
            {show === "tools" ? (
                props.isImplant ? (
                    expand && (
                        <Drawer anchor='left' variant="permanent" sx={{
                            flexShrink: 0,
                            [`& .MuiDrawer-paper`]: {
                                position: "absolute",
                                left: drawerWidth,
                                maxWidth: `calc(100vw - ${drawerWidth}px)`,
                                width: 320,
                                boxSizing: 'border-box'
                            }
                        }}>
                            <Toolbar />
                            <Tools />
                        </Drawer>
                    )
                ) : <Tools />
            ) : (
                <Box sx={{
                    p: 3,
                    ml: props.isImplant ? "" : `${drawerWidth}px`
                }}>
                    <Box sx={{
                        paddingBottom: 3,
                        width: "100%",
                        textAlign: "center"
                    }}>
                        <MouseOverPopover text={get("index.generateTry")}>
                            <IconButton aria-label={get("index.generateTry")} onClick={event => {
                                setShowTries(old => !old);
                            }}>
                                <VerkfiIcon sx={{
                                    fontSize: "1000%"
                                }} />
                            </IconButton>
                        </MouseOverPopover>
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
                                    paramTool={tries.filter(item => item !== undefined)} />
                            </Box>
                        </Box>
                    </Collapse>
                    <Box>
                        <homeWhere.Provider value="recently">
                            <Typography variant='h4'>
                                {get('use.最近使用')}
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
                                    paramTool={recentlyTools.filter(item => item !== undefined)} />
                            </Box>
                        </homeWhere.Provider>
                    </Box>
                    <Box>
                        <homeWhere.Provider value="most">
                            <Typography variant='h4'>
                                {get('use.最常使用')}
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
                                    paramTool={getParamTools(mostUsed, realTools, extensionTools)} />
                            </Box>
                        </homeWhere.Provider>
                    </Box>
                </Box>
            )}
        </Box>
    );
};
