"use client";
import {
    Box,
    Drawer,
    IconButton,
    Toolbar,
    Typography
} from "@mui/material";
import HeadBar from "@verkfi/shared/HeadBar";
import MouseOverPopover from "@verkfi/shared/Popover";
import VerkfiIcon from "@verkfi/shared/verkfiIcon";
import ToolsStackWithTools from "index/showTool";
import Sidebar from "index/sidebar";
import {
    useAtomValue,
    useSetAtom
} from "jotai";
import {
    mostUsedToolsAtom,
    recentlyToolsAtom,
    showSidebarAtom as showSidebarAtom
} from "@verkfi/shared/atoms";
import {
    get
} from "react-intl-universal";
import {
    drawerWidth
} from "setting/consts";
import {
    type ThemeHaveZIndex
} from "setting/layout";
import {
    expandAtom,
    focusingToAtom,
    showRecommendsAtom,
    sortingForAtom,
    sortingForAtomValue,
    toolsAtom
} from "index/atoms";
import {
    isImplantContext
} from "index/consts";
import Recommends from "index/recommends";
import {
    useContext
} from "react";
import {
    repoInfo as repoInfoContext
} from "layout/layoutClient";
import ToolsSkeleton from "index/showTool/toolsSkeleton";
export default function Index(props: {
    /**
     * 是否为嵌入
     */
    isImplant?: boolean;
}) {
    const showSidebar = useAtomValue(showSidebarAtom),
        mostUsed = useAtomValue(mostUsedToolsAtom),
        expand = useAtomValue(expandAtom),
        setShowRecommends = useSetAtom(showRecommendsAtom),
        tools = useAtomValue(toolsAtom),
        sortingFor = useAtomValue(sortingForAtom)(props.isImplant),
        baseSortingFor = useAtomValue(sortingForAtomValue),
        focusingTo = useAtomValue(focusingToAtom),
        repoInfo = useContext(repoInfoContext),
        recentlyTools = useAtomValue(recentlyToolsAtom);
    function Tools() {
        return (
            <Box sx={{
                p: 3,
                ml: props.isImplant ? "" : `${drawerWidth}px`
            }}>
                <ToolsStackWithTools
                    paramTool={tools}
                    focus={focusingTo}
                />
            </Box>
        );
    }
    return (props.isImplant ? showSidebar : true) && <isImplantContext.Provider value={Boolean(props.isImplant)}>
        <Box>
            {props.isImplant !== true
                && <HeadBar isIndex pageName={repoInfo.name} sx={{
                    zIndex: theme => String((theme as ThemeHaveZIndex).zIndex.drawer + 1)
                }} />
            }
            <Sidebar
                focusingTo={focusingTo}
            />
            {sortingFor === "__home__" || baseSortingFor === "__home__" ? <Box sx={{
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
                            setShowRecommends(old => !old);
                        }}>
                            <VerkfiIcon sx={{
                                fontSize: "40vw"
                            }} />
                        </IconButton>
                    </MouseOverPopover>
                </Box>
                <Recommends />
                <Box>
                    <Typography variant="h4">
                        {get("use.最近使用")}
                    </Typography>
                    <Box sx={{
                        p: 1
                    }}>
                        <ToolsStackWithTools paramTool={recentlyTools.filter(item => item !== undefined)} />
                    </Box>
                </Box>
                <Box>
                    <Typography variant="h4">
                        {get("use.最常使用")}
                    </Typography>
                    <Box sx={{
                        p: 1
                    }}>
                        <ToolsStackWithTools
                            paramTool={mostUsed}
                        />
                    </Box>
                </Box>
            </Box> : props.isImplant ? expand
                && <Drawer anchor="left" variant="permanent" sx={{
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
                </Drawer> : <Tools />}
        </Box>
    </isImplantContext.Provider>;
}
