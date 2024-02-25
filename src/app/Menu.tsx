"use client";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    InputBase,
    Typography,
    useMediaQuery,
    useTheme
} from "@mui/material";
import {
    useContext,
    useState
} from "react";
import Transition from "./components/dialog/Transition";
import MouseOverPopover from "./components/Popover";
import {
    get,
    getHTML
} from "react-intl-universal";
import {
    ArrowBackIos as ArrowBackIosIcon,
    Close as CloseIcon,
    Search as SearchIcon,
    Home as HomeIcon
} from "@mui/icons-material";
import searchBase from './index/searchBase';
import ToolsStack from "./index/ToolsStack";
import {
    getTools,
    tool
} from "./tools/info";
import {
    viewMode
} from "./index/consts";
import useStoragedState from "./components/useStoragedState";
import SwitchViewMode from "./index/SwitchViewMode";
import SwitchEditMode from "./index/SwitchEditMode";
import getToolsList from "./index/getToolsList";
import Selects from "./index/Selects";
import getList from "./index/getList";
import {
    lists
} from "./index/Sidebar";
import {
    showSidebar,
    recentlyUsed as recentlyUsedContext,
    mostUsed as mostUsedContext,
} from "./layout/layoutClient";
import stringToBoolean from "./setting/stringToBoolean";
import {
    useRouter
} from "next/navigation";
import getParamTools from "./index/getParamTools";
import VerkfiIcon from "./components/verkfiIcon/verkfiIcon";
export default function Menu() {
    const control = useContext(showSidebar),
        theme = useTheme(),
        fullScreen = useMediaQuery(theme.breakpoints.down('sm')),
        realTools = getTools(get), // 硬编码的分类
        recentlyUsed = useContext(recentlyUsedContext).value,
        mostUsed = useContext(mostUsedContext).value,
        [viewMode, setViewMode] = useStoragedState<viewMode>("viewmode", "列表模式", "list"),
        [editMode, setEditMode] = useState<boolean>(false),
        [sortingFor, setSortingFor] = useState<string>("__home__"),
        [tab, setTab] = useState<number>(0),
        [list, setList] = useState<lists>(getList),
        [searchText, setSearchText] = useState<string>(""),
        router = useRouter(),
        [sortedTools, setSortedTools] = useState(() => getToolsList(realTools)), // 排序完毕，但是不会根据搜索而改动的分类
        [tools, setTools] = useState<tool[]>(() => getToolsList(realTools)), // 经常改动的分类
        focusingTo = tools[tab] ? tools[tab].to : "", // 每次渲染会重新执行
        [editing, setEditing] = useState<boolean>(searchText === "");
    function searchTools(search: string) {
        if (search !== "") {
            setEditing(false);
        } else {
            setEditing(true);
        }
        if (sortingFor === "__home__") {
            setSortingFor("__global__");
        }
        setTools(searchBase(sortedTools, search));
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
        <>
            <Dialog onKeyDown={event => {
                if (event.key === "Tab" || event.key === "Enter") {
                    event.preventDefault();
                }
            }} onKeyUp={event => {
                if (event.key === "Tab") {
                    event.preventDefault();
                    handleTab();
                } else if (event.key === "Enter") {
                    event.preventDefault();
                    handleEnter();
                }
            }} fullScreen={fullScreen} onClose={() => {
                control.set("false");
            }} sx={{
                ".MuiDialog-paper": {
                    maxWidth: "unset"
                },
                zIndex: "38601"
            }} open={stringToBoolean(control.show)} keepMounted TransitionComponent={Transition}>
                <DialogTitle sx={{
                    m: 0,
                    p: 2,
                    display: "flex"
                }}>
                    {sortingFor !== "__home__" && (
                        <IconButton type="button" sx={{
                            p: '10px 5px'
                        }} aria-label="back" onClick={() => {
                            setSearchText("");
                            setSortingFor("__home__");
                            setSortedTools(() => getToolsList(realTools));
                            setEditing(true);
                            setTools(() => getToolsList(realTools));
                        }}>
                            <ArrowBackIosIcon />
                        </IconButton>
                    )}
                    <MouseOverPopover text={get('搜索')}>
                        <IconButton type="button" sx={{
                            p: '10px 5px'
                        }} aria-label="search" onClick={() => {
                            searchTools(searchText);
                        }}>
                            <SearchIcon />
                        </IconButton>
                    </MouseOverPopover>
                    <InputBase value={searchText} sx={{
                        ml: 1,
                        flex: 1
                    }} placeholder={get('搜索工具')} inputProps={{
                        'aria-label': 'searchtools'
                    }} onChange={event => {
                        if (searchText !== event.target.value) {
                            setSearchText(event.target.value);
                            searchTools(event.target.value);
                            setTab(0);
                        }
                    }} />
                    <IconButton
                        aria-label="close"
                        onClick={event => {
                            control.set("false");
                        }}
                        sx={{
                            position: 'absolute',
                            right: 8
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    {sortingFor === "__home__" ? <>
                        <Box>
                            <Typography variant='h4'>
                                {get('category.分类')}
                                <Selects
                                    setEditMode={setEditMode}
                                    setEditing={setEditing}
                                    modifyClickCount={value => null}
                                    list={list}
                                    setList={setList}
                                    searchText={searchText}
                                    sortingFor={sortingFor}
                                    setSortingFor={setSortingFor}
                                    searchTools={searchTools}
                                    editMode={editMode}
                                    setTools={setTools}
                                    setSortedTools={setSortedTools}
                                    setSearchText={setSearchText}
                                />
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant='h4'>
                                {get('use.最近使用')}
                            </Typography>
                            <Box sx={{
                                p: 1
                            }}>
                                <ToolsStack
                                    viewMode={viewMode}
                                    searchText=""
                                    sortingFor={"__home__"}
                                    setTools={tools => null}
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
                                {get('use.最常使用')}
                            </Typography>
                            <Box sx={{
                                p: 1
                            }}>
                                <ToolsStack
                                    viewMode={viewMode}
                                    searchText=""
                                    sortingFor={"__home__"}
                                    setTools={tools => null}
                                    editMode={false}
                                    paramTool={getParamTools(mostUsed, realTools)} />
                            </Box>
                        </Box>
                    </> : <>
                        <ToolsStack
                            paramTool={tools}
                            viewMode={viewMode}
                            searchText={searchText}
                            sortingFor={sortingFor}
                            setTools={setTools}
                            editMode={editMode}
                            focus={focusingTo}
                        />
                    </>}
                </DialogContent>
                {sortingFor !== "__home__" && <DialogActions>
                    {get("press")}
                    <Button onClick={handleTab}>
                        Tab
                    </Button>
                    {get("switch")}{", "}
                    {get("press")}
                    <Button onClick={handleEnter}>
                        Enter
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
                            Verkfi
                        </Typography>
                    </Box>
                    <Box sx={{
                        display: "flex"
                    }}>
                        <MouseOverPopover text={get("主页")}>
                            <IconButton color="primary" sx={{
                                p: '10px'
                            }} aria-label={get("主页")} onClick={_event => {
                                router.push("/");
                            }}>
                                <HomeIcon />
                            </IconButton>
                        </MouseOverPopover>
                        <SwitchViewMode viewMode={viewMode} setViewMode={setViewMode} />
                        {(editing && sortingFor !== "__extended__") && <SwitchEditMode editMode={editMode} setEditMode={setEditMode} />}
                    </Box>
                </DialogActions>
            </Dialog>
        </>
    );
}