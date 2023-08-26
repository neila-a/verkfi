"use client";
import I18N from 'react-intl-universal';
import {
    drawerWidth
} from '../setting/page';
import {
    IconButton,
    InputBase,
    Paper, Drawer,
    Toolbar
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
} from '../page';
export default function Sidebar(props: {
    /**
     * 是否为嵌入
     */
    isImplant?: boolean;
    viewMode: viewMode;
    setViewMode: setState<viewMode>;
    editMode: boolean;
    setEditMode: setState<boolean>;
    searchText: string;
    setSearchText: setState<string>;
    /**
     * 搜索工具
     */
    searchTools(search: string): void;
}) {
    const {
        viewMode, setViewMode, editMode, setEditMode, searchText, setSearchText, searchTools
    } = props;
    return <Drawer variant="permanent" sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box'
        }
    }}>
        {!props.isImplant && <Toolbar />}
        <Paper sx={{
            margin: '2px 4px',
            p: '2px 4px',
            display: 'flex',
            alignItems: 'center'
        }}>
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
        </Paper>
        <Buttons editMode={editMode} viewMode={viewMode} setEditMode={setEditMode} setViewMode={setViewMode} searchText={searchText} />
    </Drawer>;
}
