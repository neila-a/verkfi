"use client";
import {
    Search as SearchIcon
} from "@mui/icons-material";
import {
    Box,
    Drawer,
    IconButton,
    InputAdornment,
    TextField,
    Toolbar
} from "@mui/material";
import MouseOverPopover from "components/Popover";
import {
    setState
} from "declare";
import {
    useAtom
} from "jotai";
import {
    lists
} from "layout/layoutClient";
import {
    useState
} from "react";
import {
    get
} from "react-intl-universal";
import {
    drawerWidth
} from "setting/consts";
import {
    tool
} from "tools/info";
import {
    viewMode as viewModeAtom
} from "layout/layoutClient";
import Buttons from "./buttons";
import Selects from "./selects";
import SingleSelect from "./selects/SingleSelect";
export type lists = [string, string[]][];
export default function Sidebar(props: {
    /**
     * 是否为嵌入
     */
    isImplant?: boolean;
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
            editMode,
            setEditMode,
            searchText,
            setSearchText,
            searchTools,
            setTools,
            sortingFor,
            setSortingFor
        } = props,
        [viewMode, setViewMode] = useAtom(viewModeAtom),
        [editing, setEditing] = useState<boolean>(searchText === ""),
        [clickCount, setClickCount] = useState<number>(0),
        [list, setList] = useAtom(lists);
    return (
        <Drawer variant="permanent" sx={{
            maxWidth: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
                maxWidth: drawerWidth,
                boxSizing: "border-box"
            }
        }}>
            <Toolbar />
            <TextField InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <MouseOverPopover text={get("搜索")}>
                            <IconButton sx={{
                                p: 0
                            }} type="button" aria-label={get("搜索")} onClick={() => {
                                searchTools(searchText);
                            }}>
                                <SearchIcon />
                            </IconButton>
                        </MouseOverPopover>
                    </InputAdornment>
                )
            }} value={searchText} onKeyDown={event => {
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
            }} placeholder={get("搜索工具")} inputProps={{
                "aria-label": get("搜索工具")
            }} onChange={event => {
                setSearchText(event.target.value);
                searchTools(event.target.value);
                if (sortingFor === "__home__") {
                    setSortingFor("__global__");
                    props.setShow("tools");
                }
            }} />
            <Box sx={{
                textAlign: "center"
            }}>
                {!props.isImplant && (
                    <SingleSelect
                        dragButton={<></>}
                        editMode={editMode}
                        isSidebar
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
                        isSidebar
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
                isImplant={props.isImplant}
                expand={props.expand}
                setExpand={props.setExpand}
                setEditMode={setEditMode}
                editing={editing}
            />
        </Drawer>
    );
}
