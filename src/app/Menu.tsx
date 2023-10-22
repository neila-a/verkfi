"use client";
import {
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    InputBase,
    Paper,
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
import I18N from "react-intl-universal";
import {
    ArrowBackIos as ArrowBackIosIcon,
    Close as CloseIcon,
    Handyman as HandymanIcon,
    Search as SearchIcon
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
import { showSidebar } from "./layoutClient";
import stringToBoolean from "./setting/stringToBoolean";
export default function Menu() {
    const control = useContext(showSidebar),
        theme = useTheme(),
        fullScreen = useMediaQuery(theme.breakpoints.down('sm')),
        realTools = getTools(I18N), // 硬编码的分类
        [recentlyUsed, setRecentlyUsed] = useStoragedState<string>("recently-tools", "最近使用的工具", "[]"),
        [viewMode, setViewMode] = useStoragedState<viewMode>("viewmode", "列表模式", "grid"),
        [editMode, setEditMode] = useState<boolean>(false),
        [sortingFor, setSortingFor] = useState<string>("__home__"),
        [list, setList] = useState<lists>(getList),
        [searchText, setSearchText] = useState<string>(""),
        [sortedTools, setSortedTools] = useState(() => getToolsList(realTools)), // 排序完毕，但是不会根据搜索而改动的分类
        [tools, setTools] = useState<tool[]>(() => getToolsList(realTools)), // 经常改动的分类
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
    return (
        <>
            <Dialog fullScreen={fullScreen} onClose={() => {
                control.set("false");
            }} sx={{
                ".MuiDialog-paper": {
                    maxWidth: "unset"
                }
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
                    <MouseOverPopover text={I18N.get('搜索')}>
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
                    }} placeholder={I18N.get('搜索工具')} inputProps={{
                        'aria-label': 'searchtools',
                    }} onChange={event => {
                        setSearchText(event.target.value);
                        searchTools(event.target.value);
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
                                {I18N.get('最近使用')}
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
                                {I18N.get('分类')}
                                <Selects
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
                    </> : <>
                        <ToolsStack
                            paramTool={tools}
                            viewMode={viewMode}
                            searchText={searchText}
                            sortingFor={sortingFor}
                            setTools={setTools}
                            editMode={editMode}
                        />
                    </>}
                </DialogContent>
                <DialogActions sx={{
                    display: "flex",
                    justifyContent: "space-between"
                }}>
                    <Box sx={{
                        display: "flex"
                    }}>
                        <HandymanIcon />
                        <Typography sx={{
                            ml: 1
                        }}>
                            NeilaTools
                        </Typography>
                    </Box>
                    <Box sx={{
                        display: "flex"
                    }}>
                        <SwitchViewMode viewMode={viewMode} setViewMode={setViewMode} />
                        {(editing && sortingFor !== "__extended__") && <SwitchEditMode editMode={editMode} setEditMode={setEditMode} />}
                    </Box>
                </DialogActions>
            </Dialog>
        </>
    );
}