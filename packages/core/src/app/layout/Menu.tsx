"use client";
import {
    ArrowBackIos as ArrowBackIosIcon,
    Close as CloseIcon,
    Home as HomeIcon,
    Search as SearchIcon
} from "@mui/icons-material";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
    useMediaQuery,
    useTheme
} from "@mui/material";
import MouseOverPopover from "@verkfi/shared/Popover";
import Transition from "@verkfi/shared/dialog/Transition";
import VerkfiIcon from "@verkfi/shared/verkfiIcon/verkfiIcon";
import convertExtensionTools from "index/convertExtensionTools";
import ToolsStack from "index/showTool";
import SwitchEditMode from "index/sidebar/buttons/SwitchEditMode";
import SwitchViewMode from "index/sidebar/buttons/SwitchViewMode";
import Selects from "index/sidebar/selects";
import toolsListAtom from "@verkfi/shared/atoms/toolsList";
import useMostUsedTools from "index/useMostUsedTools";
import {
    useAtom
} from "jotai";
import {
    repoInfo
} from "layout/layoutClient";
import {
    recentlyUsed as recentlyUsedAtom,
    showSidebar
} from "@verkfi/shared/atoms";
import Link from "next/link";
import {
    useContext,
    useState
} from "react";
import {
    get
} from "react-intl-universal";
import toolsInfoAtom, {
    tool
} from "tools/info";
import extensionsAtom from "@verkfi/shared/atoms/extensions";
import {
    editingAtom,
    searchTextAtom,
    sortedToolsAtom,
    sortingForAtom,
    tabAtom,
    toolsAtom
} from "index/atoms";
import {
    isImplantContext
} from "index/consts";
export default function Menu() {
    const [control, setControl] = useAtom(showSidebar),
        theme = useTheme(),
        fullScreen = useMediaQuery(theme.breakpoints.down("sm")),
        [realTools] = useAtom(toolsInfoAtom),
        [recentlyUsed] = useAtom(recentlyUsedAtom),
        sortingFor = useAtom(sortingForAtom)[0](false),
        setSortingFor = useAtom(sortingForAtom)[1],
        [tab, setTab] = useAtom(tabAtom),
        [searchText, setSearchText] = useAtom(searchTextAtom),
        [extensionTools] = useAtom(extensionsAtom),
        [gotToolsList] = useAtom(toolsListAtom),
        mostUsed = useMostUsedTools(),
        [, setSortedTools] = useAtom(sortedToolsAtom),
        [tools] = useAtom(toolsAtom),
        setTools = useAtom(toolsAtom)[1],
        focusingTo = tools[tab] ? tools[tab].to : "", // 每次渲染会重新执行
        upper = useContext(repoInfo).name.charAt(0).toUpperCase() + useContext(repoInfo).name.slice(1),
        [editing, setEditing] = useAtom(editingAtom);
    function searchTools(search: string) {
    }
    function handleTab() {
        setTab(old => (old + 1) % tools.length);
        const selectool = document.getElementById(`toolAbleToSelect-${focusingTo}`) as HTMLDivElement | null;
        if (selectool !== null) {
            selectool.scrollIntoView({
                block: "start",
                behavior: "smooth"
            });
        }
    }
    function handleEnter() {
        const selectool = document.getElementById(`toolAbleToSelect-${focusingTo}`) as HTMLDivElement | null;
        if (selectool !== null) {
            selectool.click();
        }
    }
    return (
        <isImplantContext.Provider value={false}>
            <Dialog onKeyDown={event => {
                if (event.key === "Tab" || event.key === "Enter") {
                    event.preventDefault();
                }
            }} onKeyUp={event => {
                switch (event.key) {
                    case "Tab":
                        event.preventDefault();
                        handleTab();
                        break;
                    case "Enter":
                        event.preventDefault();
                        handleEnter();
                        break;
                }
            }} fullScreen={fullScreen} onClose={() => {
                setControl(false);
            }} sx={{
                ".MuiDialog-paper": {
                    maxWidth: "unset"
                },
                zIndex: "38601"
            }} open={control} keepMounted TransitionComponent={Transition}>
                <DialogTitle sx={{
                    m: 0,
                    p: 0,
                    display: "flex",
                    alignItems: "center"
                }}>
                    <TextField InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                {sortingFor !== "__home__" && (
                                    <MouseOverPopover text={get("back")}>
                                        <IconButton type="button" aria-label={get("back")} onClick={() => {
                                            setSearchText("", false);
                                            setSortingFor("__home__");
                                            setSortedTools(gotToolsList);
                                            setEditing(true);
                                            setTools("refresh");
                                        }}>
                                            <ArrowBackIosIcon />
                                        </IconButton>
                                    </MouseOverPopover>
                                )}
                                <MouseOverPopover text={get("搜索")}>
                                    <IconButton type="button" aria-label={get("搜索")} onClick={() => {
                                        searchTools(searchText);
                                    }}>
                                        <SearchIcon />
                                    </IconButton>
                                </MouseOverPopover>
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <MouseOverPopover text={get("close")}>
                                    <IconButton aria-label={get("close")} onClick={event => {
                                        setControl(false);
                                    }}>
                                        <CloseIcon />
                                    </IconButton>
                                </MouseOverPopover>
                            </InputAdornment>
                        )
                    }} fullWidth autoFocus value={searchText} sx={{
                        flex: 1
                    }} placeholder={get("搜索工具")} inputProps={{
                        "aria-label": get("搜索工具")
                    }} onChange={event => {
                        if (searchText !== event.target.value) {
                            setSearchText(event.target.value, false);
                            searchTools(event.target.value);
                            setTab(0);
                        }
                    }} />
                </DialogTitle>
                <DialogContent dividers>
                    {sortingFor === "__home__" ? (
                        <>
                            <Box>
                                <Typography variant="h4">
                                    {get("category.分类")}
                                    <Selects
                                        modifyClickCount={value => null}
                                    />
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="h4">
                                    {get("use.最近使用")}
                                </Typography>
                                <Box sx={{
                                    p: 1
                                }}>
                                    <ToolsStack
                                        paramTool={recentlyUsed.map(to => (
                                            0
                                            || realTools.find(single => single.to === to)
                                            || convertExtensionTools(extensionTools).find(single => `/tools/extension?tool=${to}` === single.to))
                                        ).filter((item: tool | 0) => item !== 0 && item !== undefined) as unknown as tool[]} />
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
                                        paramTool={mostUsed} />
                                </Box>
                            </Box>
                        </>
                    ) : (
                        <ToolsStack
                            paramTool={tools}
                            focus={focusingTo}
                        />
                    )}
                </DialogContent>
                {sortingFor !== "__home__" && (
                    <DialogActions>
                        {get("press")}
                        <Button onClick={handleTab}>
                            <kbd>
                                Tab
                            </kbd>
                        </Button>
                        {get("switch")}，
                        {get("press")}
                        <Button onClick={handleEnter}>
                            <kbd>
                                Enter
                            </kbd>
                        </Button>
                        {get("enter")}
                    </DialogActions>
                )}
                <DialogActions sx={{
                    display: "flex",
                    justifyContent: "space-between"
                }}>
                    <Box sx={{
                        display: "flex"
                    }}>
                        <VerkfiIcon />
                        <Typography sx={{
                            ml: 1
                        }}>
                            {upper}
                        </Typography>
                    </Box>
                    <Box sx={{
                        display: "flex"
                    }}>
                        <Link href="/">
                            <MouseOverPopover text={get("主页")}>
                                <IconButton color="primary" sx={{
                                    p: 1
                                }} aria-label={get("主页")}>
                                    <HomeIcon />
                                </IconButton>
                            </MouseOverPopover>
                        </Link>
                        <SwitchViewMode />
                        {(editing && sortingFor !== "__extension__") && (
                            <SwitchEditMode />
                        )}
                    </Box>
                </DialogActions>
            </Dialog>
        </isImplantContext.Provider>
    );
}
