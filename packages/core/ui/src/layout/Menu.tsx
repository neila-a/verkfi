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
    Theme,
    Typography,
    useMediaQuery
} from "@mui/material";
import MouseOverPopover from "@verkfi/shared/Popover";
import Transition from "@verkfi/shared/dialog/Transition";
import VerkfiIcon from "@verkfi/shared/verkfiIcon";
import ToolsStackWithTools from "index/showTool";
import SwitchEditMode from "index/sidebar/buttons/SwitchEditMode";
import SwitchViewMode from "index/sidebar/buttons/SwitchViewMode";
import Selects from "index/sidebar/selects";
import toolsListAtom from "@verkfi/shared/atoms/toolsList";
import {
    useAtom,
    useAtomValue,
    useSetAtom
} from "jotai";
import {
    repoInfo
} from "layout/layoutClient";
import {
    mostUsedToolsAtom,
    recentlyToolsAtom,
    showSidebarAtom
} from "@verkfi/shared/atoms";
import {
    startTransition,
    useContext
} from "react";
import {
    get
} from "react-intl-universal";
import {
    editingAtom,
    homeList,
    searchTextAtom,
    sortedToolsAtom,
    sortingForAtom,
    tabAtom,
    toolsAtom
} from "index/atoms";
import {
    isImplantContext
} from "index/consts";
import {
    useResetAtom
} from "jotai/utils";
import {
    Link
} from "react-router-dom";
export default function Menu() {
    const [control, setControl] = useAtom(showSidebarAtom),
        fullScreen = useMediaQuery<Theme>(theme => theme.breakpoints.down("sm")),
        sortingFor = useAtomValue(sortingForAtom)(false),
        setSortingFor = useSetAtom(sortingForAtom),
        [tab, setTab] = useAtom(tabAtom),
        recentlyUsedTools = useAtomValue(recentlyToolsAtom),
        [searchText, setSearchText] = useAtom(searchTextAtom),
        gotToolsList = useAtomValue(toolsListAtom),
        mostUsed = useAtomValue(mostUsedToolsAtom),
        setSortedTools = useSetAtom(sortedToolsAtom),
        tools = useAtomValue(toolsAtom),
        resetTools = useResetAtom(toolsAtom),
        focusingTo = tools[tab] ? tools[tab].to : "", // 每次渲染会重新执行
        upper = useContext(repoInfo).name.charAt(0).toUpperCase() + useContext(repoInfo).name.slice(1),
        [editing, setEditing] = useAtom(editingAtom);
    function handleTab() {
        setTab(old => (old + 1) % tools.length);
        const selectool = document.getElementById(`toolAbleToSelect-${focusingTo}`) as HTMLDivElement;
        selectool?.scrollIntoView?.({
            block: "start",
            behavior: "smooth"
        });
    }
    function handleEnter() {
        const selectool = document.getElementById(`toolAbleToSelect-${focusingTo}`) as HTMLDivElement | null;
        selectool?.click?.();
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
            }} open={control} TransitionComponent={Transition}>
                <DialogTitle sx={{
                    m: 0,
                    p: 0,
                    display: "flex",
                    alignItems: "center"
                }}>
                    <TextField slotProps={{
                        input: {
                            startAdornment: <InputAdornment position="start">
                                {sortingFor !== homeList && <MouseOverPopover text={get("back")}>
                                    <IconButton type="button" aria-label={get("back")} onClick={() => {
                                        setSearchText("", false);
                                        setSortingFor(homeList);
                                        setSortedTools(gotToolsList);
                                        setEditing(true);
                                        startTransition(() => resetTools());
                                    }}>
                                        <ArrowBackIosIcon />
                                    </IconButton>
                                </MouseOverPopover>}
                                <MouseOverPopover text={get("搜索")}>
                                    <IconButton type="button" aria-label={get("搜索")}>
                                        <SearchIcon />
                                    </IconButton>
                                </MouseOverPopover>
                            </InputAdornment>,
                            endAdornment: <InputAdornment position="end">
                                <MouseOverPopover text={get("close")}>
                                    <IconButton aria-label={get("close")} onClick={event => {
                                        setControl(false);
                                    }}>
                                        <CloseIcon />
                                    </IconButton>
                                </MouseOverPopover>
                            </InputAdornment>
                        },
                        htmlInput: {
                            "aria-label": get("搜索工具")
                        }
                    }} fullWidth autoFocus value={searchText} sx={{
                        flex: 1
                    }} placeholder={get("搜索工具")} onChange={event => {
                        if (searchText !== event.target.value) {
                            setSearchText(event.target.value, false);
                            setTab(0);
                        }
                    }} />
                </DialogTitle>
                <DialogContent dividers>
                    {sortingFor === homeList ? <>
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
                                <ToolsStackWithTools paramTool={recentlyUsedTools} />
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
                                    paramTool={mostUsed} />
                            </Box>
                        </Box>
                    </> : <ToolsStackWithTools
                        paramTool={tools}
                        focus={focusingTo}
                    />}
                </DialogContent>
                {sortingFor !== homeList && <DialogActions>
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
                </DialogActions>}
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
                        <Link to="/">
                            <MouseOverPopover text={get("主页")}>
                                <IconButton color="primary" sx={{
                                    p: 1
                                }} aria-label={get("主页")}>
                                    <HomeIcon />
                                </IconButton>
                            </MouseOverPopover>
                        </Link>
                        <SwitchViewMode />
                        {editing && sortingFor !== "__extension__" && <SwitchEditMode />}
                    </Box>
                </DialogActions>
            </Dialog>
        </isImplantContext.Provider>
    );
}
