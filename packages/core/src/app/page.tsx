"use client";
import {
    Box,
    Collapse,
    Drawer,
    IconButton,
    Toolbar,
    Typography
} from "@mui/material";
import HeadBar from "components/HeadBar";
import MouseOverPopover from "components/Popover";
import VerkfiIcon from "components/verkfiIcon/verkfiIcon";
import {
    setState
} from "declare";
import convertExtensionTools from "index/convertExtensionTools";
import ToolsStack from "index/showTool";
import Sidebar from "index/sidebar";
import searchBase from "index/sidebar/searchBase";
import toolsListAtom from "atoms/toolsList";
import useMostUsedTools from "index/useMostUsedTools";
import triesAtom from "atoms/tries";
import {
    useAtom
} from "jotai";
import extensionsAtom from "atoms/extensions";
import {
    recentlyUsed as recentlyUsedAtom,
    showSidebar as showSidebarAtom
} from "atoms";
import {
    useEffect,
    useState
} from "react";
import {
    get
} from "react-intl-universal";
import {
    drawerWidth
} from "setting/consts";
import {
    type ThemeHaveZIndex
} from "setting/layout";
import toolsInfoAtom, {
    tool
} from "tools/info";
import {
    sortingForAtom,
    sortingForAtomValue,
    tabAtom,
    toolsAtom
} from "index/atoms";
import {
    isImplantContext
} from "index/consts";
export default function Index(props: {
    /**
     * 是否为嵌入
     */
    isImplant?: boolean;
    expand?: boolean;
    setExpand?: setState<boolean>;
}): JSX.Element {
    const [realTools] = useAtom(toolsInfoAtom),
        [extensionTools] = useAtom(extensionsAtom),
        [toolsList] = useAtom(toolsListAtom),
        [showSidebar] = useAtom(showSidebarAtom),
        [recentlyUsed] = useAtom(recentlyUsedAtom),
        mostUsed = useMostUsedTools(),
        [sortedTools, setSortedTools] = useState(toolsList),
        [expandThis, setExpandThis] = useState<boolean>(false),
        [showTries, setShowTries] = useState<boolean>(false),
        [tools] = useAtom(toolsAtom),
        setTools = useAtom(toolsAtom)[1],
        [tab] = useAtom(tabAtom),
        sortingFor = useAtom(sortingForAtom)[0](props.isImplant),
        [baseSortingFor] = useAtom(sortingForAtomValue),
        focusingTo = tools[tab] ? tools[tab].to : "", // 每次渲染会重新执行
        [tries] = useAtom(triesAtom),
        recentlyTools = recentlyUsed.map(to => {
            const converted = convertExtensionTools(extensionTools);
            return 0
                || realTools.find(single => single.to === to)
                || converted.find(single => `/tools/extension?tool=${to}` === single.to);
        }).filter((item: tool | 0) => item !== 0) satisfies unknown satisfies tool[];
    let expand = expandThis,
        setExpand = setExpandThis;
    if (props.setExpand) {
        expand = props.expand;
        setExpand = props.setExpand;
    }
    /**
     * 搜索工具
     */
    function searchTools(search: string) {
        setTools(searchBase(sortedTools, search));
        setExpand(true);
    }
    function Tools() {
        return (
            <Box sx={{
                p: 3,
                ml: props.isImplant ? "" : `${drawerWidth}px`
            }}>
                <ToolsStack
                    paramTool={tools}
                    focus={focusingTo}
                />
            </Box>
        );
    }
    return (props.isImplant ? showSidebar : true) && (
        <isImplantContext.Provider value={Boolean(props.isImplant)}>
            <Box>
                {props.isImplant !== true && (
                    <HeadBar isIndex pageName="Verkfi" sx={{
                        zIndex: theme => String((theme as ThemeHaveZIndex).zIndex.drawer + 1)
                    }} />
                )}
                <Sidebar
                    focusingTo={focusingTo}
                    searchTools={searchTools}
                    setSortedTools={setSortedTools}
                    expand={expand}
                    setExpand={setExpand}
                />
                {sortingFor === "__home__" || baseSortingFor === "__home__" ? (
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
                                        fontSize: "40vw"
                                    }} />
                                </IconButton>
                            </MouseOverPopover>
                        </Box>
                        <Collapse in={showTries}>
                            <Box>
                                <Typography variant="h4">
                                    {get("index.trythese")}
                                </Typography>
                                <Box sx={{
                                    p: 1
                                }}>
                                    <ToolsStack
                                        paramTool={tries.filter(item => item !== undefined)} />
                                </Box>
                            </Box>
                        </Collapse>
                        <Box>
                            <Typography variant="h4">
                                {get("use.最近使用")}
                            </Typography>
                            <Box sx={{
                                p: 1
                            }}>
                                <ToolsStack
                                    paramTool={recentlyTools.filter(item => item !== undefined)} />
                            </Box>
                        </Box>
                        <Box>
                            <Typography variant="h4">
                                {get("use.最常使用")}
                            </Typography>
                            <Box sx={{
                                p: 1
                            }}>
                                <ToolsStack
                                    paramTool={mostUsed}
                                />
                            </Box>
                        </Box>
                    </Box>
                ) : (
                    props.isImplant ? (
                        expand && (
                            <Drawer anchor="left" variant="permanent" sx={{
                                flexShrink: 0,
                                [`& .MuiDrawer-paper`]: {
                                    position: "absolute",
                                    left: drawerWidth,
                                    maxWidth: `calc(100vw - ${drawerWidth}px)`,
                                    width: 320,
                                    boxSizing: "border-box"
                                }
                            }}>
                                <Toolbar />
                                <Tools />
                            </Drawer>
                        )
                    ) : <Tools />
                )}
            </Box>
        </isImplantContext.Provider>
    );
}
