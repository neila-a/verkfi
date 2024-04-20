"use client";
import {
    get
} from 'react-intl-universal';
import {
    drawerWidth
} from 'setting/consts';
import {
    IconButton,
    InputBase,
    Paper,
    Drawer,
    Toolbar,
    useTheme,
    Box
} from "@mui/material";
import {
    Search as SearchIcon
} from "@mui/icons-material";
import MouseOverPopover from "components/Popover";
import Buttons from './Buttons';
import {
    setState
} from 'declare';
import {
    viewMode
} from './consts';
import {
    useContext,
    useState
} from 'react';
import {
    tool
} from "tools/info";
export type lists = [string, string[]][];
import SingleSelect from './SingleSelect';
import Selects from './Selects';
import {
    lists
} from 'layout/layoutClient';
export default function Sidebar(props: {
    /**
     * 是否为嵌入
     */
    isImplant?: boolean;
    viewMode: viewMode;
    setViewMode: setState<viewMode>;
    setShow: setState<"tools" | "home">;
    editMode: boolean;
    setEditMode: setState<boolean>;
    searchText: string;
    setSearchText: setState<string>;
    /**
     * 搜索工具
     */
    searchTools(search: string): void;
    tools: tool[];
    setTab: setState<number>;
    focusingTo: Lowercase<string>;
    setTools: setState<tool[]>;
    setSortedTools: setState<tool[]>;
    sortingFor: string;
    setSortingFor: setState<string>;
    expand: boolean;
    setExpand: setState<boolean>;
}) {
    const {
        viewMode,
        setViewMode,
        editMode,
        setEditMode,
        searchText,
        setSearchText,
        searchTools,
        setTools,
        sortingFor,
        setSortingFor
    } = props,
        [editing, setEditing] = useState<boolean>(searchText === ""),
        [clickCount, setClickCount] = useState<number>(0),
        usedList = useContext(lists),
        list = usedList.value,
        setList = usedList.set;
    return (
        <Drawer variant="permanent" sx={{
            maxWidth: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
                maxWidth: drawerWidth,
                boxSizing: 'border-box'
            }
        }}>
            <Toolbar />
            <Box sx={{
                display: "flex"
            }}>
                <MouseOverPopover text={get('搜索')}>
                    <IconButton type="button" sx={{
                        p: 1
                    }} aria-label={get('搜索')} onClick={() => {
                        searchTools(searchText);
                    }}>
                        <SearchIcon />
                    </IconButton>
                </MouseOverPopover>
                <InputBase value={searchText} sx={{
                    ml: 1,
                    flex: 1
                }} onKeyDown={event => {
                    if (event.key === "Tab" || event.key === "Enter") {
                        event.preventDefault();
                    }
                }} onKeyUp={event => {
                    if (event.key === "Tab") {
                        event.preventDefault();
                        props.setTab(old => (old + 1) % props.tools.length);
                    } else if (event.key === "Enter") {
                        event.preventDefault();
                        const selectool = document.getElementById(`toolAbleToSelect-${props.focusingTo}`) as HTMLDivElement | null;
                        if (selectool !== null) {
                            selectool.click();
                        }
                    }
                }} placeholder={get('搜索工具')} inputProps={{
                    'aria-label': get('搜索工具'),
                }} onChange={event => {
                    setSearchText(event.target.value);
                    searchTools(event.target.value);
                    if (sortingFor === "__home__") {
                        setSortingFor("__global__");
                        props.setShow("tools");
                    }
                }} />
            </Box>
            <Box sx={{
                textAlign: "center"
            }}>
                {!props.isImplant && (
                    <SingleSelect
                        dragButton={<></>}
                        editMode={editMode}
                        isSidebar={true}
                        sortingFor={sortingFor}
                        searchText={searchText}
                        wantSortingFor="__home__"
                        tool={get("主页")}
                        onClick={event => {
                            props.setShow("home");
                            setSortingFor("__home__");
                        }}
                        editButton={<></>}
                    />
                )}
                <Box onClick={event => {
                    props.setShow("tools");
                    props.setExpand(true);
                    if (clickCount === 1) {
                        props.setExpand(false);
                        setClickCount(0);
                    }
                }}>
                    <Selects
                        setEditMode={setEditMode}
                        isSidebar
                        list={list}
                        setList={setList}
                        editMode={editMode}
                        setEditing={setEditing}
                        sortingFor={sortingFor}
                        setSortingFor={setSortingFor}
                        searchText={searchText}
                        setSearchText={setSearchText}
                        setSortedTools={props.setSortedTools}
                        setTools={setTools}
                        searchTools={searchTools}
                        modifyClickCount={value => {
                            if (value === "++") {
                                setClickCount(old => old + 1);
                            } else {
                                setClickCount(value);
                            }
                        }}
                    />
                </Box>
            </Box>
            <Buttons
                editMode={editMode}
                viewMode={viewMode}
                isImplant={props.isImplant}
                expand={props.expand}
                setExpand={props.setExpand}
                setEditMode={setEditMode}
                setViewMode={setViewMode}
                editing={editing}
                setList={setList}
            />
        </Drawer>
    );
}
