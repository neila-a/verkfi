"use client";
import {
    get
} from 'react-intl-universal';
import {
    drawerWidth
} from '../setting/consts';
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
import MouseOverPopover from "../components/Popover";
import Buttons from './Buttons';
import {
    setState
} from '../declare';
import {
    viewMode
} from './consts';
import {
    useEffect,
    useState
} from 'react';
import {
    tool
} from "../tools/info";
import Center from '../components/center/Center';
export type lists = [string, string[]][];
import getList from './getList';
import SingleSelect from './SingleSelect';
import Selects from './Selects';
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
        [list, setList] = useState<lists>(getList);
    var clickCount = 0;
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
            <Paper sx={{
                margin: '2px 4px',
                p: '2px 4px',
                display: 'flex',
                alignItems: 'center'
            }}>
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
                    'aria-label': 'searchtools',
                }} onChange={event => {
                    setSearchText(event.target.value);
                    searchTools(event.target.value);
                }} />
            </Paper>
            <Center>
                {!props.isImplant && <SingleSelect dragButton={<></>} editMode={editMode} isSidebar={true} sortingFor={sortingFor} searchText={searchText} setEditing={setEditing} wantSortingFor="__home__" tool={get("主页")} onClick={event => {
                    props.setShow("home");
                    setSortingFor("__home__");
                }} editButton={<></>} />}
                <Box onClick={event => {
                    props.setShow("tools");
                    props.setExpand(true);
                    if (clickCount === 1) {
                        props.setExpand(false);
                        clickCount = 0;
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
                                clickCount++;
                            } else {
                                clickCount = value as number;
                            }
                        }}
                    />
                </Box>
            </Center>
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
