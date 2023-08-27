"use client";
import I18N from 'react-intl-universal';
import {
    drawerWidth
} from '../setting/page';
import {
    IconButton,
    InputBase,
    Paper,
    Drawer,
    Toolbar,
    Button
} from "@mui/material";
import {
    Edit as EditIcon,
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
import {
    useState
} from 'react';
import {
    getTools,
    tool
} from "../tools/info";
import checkOption from '../setting/checkOption';
import Center from '../components/center/Center';
import getToolsList from './getToolsList';
import {
    locales
} from '../layoutClient';
export type lists = [string, string[]][];
import EditToolsListDialog from "./EditToolsListDialog";
import CheckDialog from '../components/dialog/CheckDialog';
import setSetting from '../setting/setSetting';
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
    setTools: setState<tool[]>;
    setSortingFor: setState<string>;
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
        setSortingFor
    } = props,
        [realTools, setRealTools] = useState(getToolsList(getTools(I18N)));
    var [list, setList] = useState<lists>(() => {
        const defaultList: lists = [],
            defaultListJSON = JSON.stringify(defaultList),
            realListJSON = checkOption("lists", "集合列表", defaultListJSON),
            lists = realListJSON || defaultListJSON;
        return JSON.parse(lists) as lists;
    });
    var [dialogOpen, setDialogOpen] = useState<boolean>(false),
        [dialogTools, setDialogTools] = useState<string[]>([]),
        [removeDialogOpen, setRemoveDialogOpen] = useState<boolean>(false),
        [dialogListName, setDialogListName] = useState<string>("");
    return (
        <Drawer variant="permanent" sx={{
            maxWidth: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
                maxWidth: drawerWidth,
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
            <Center>
                {([[I18N.get("全部"), realTools.map(atool => atool.to)]] as lists).concat(list).map(single => {
                    const isAll = Object.values(locales).some(singleLang => {
                        const strings = Object.values(singleLang);
                        let have: boolean = strings.includes(single[0]);
                        return have;
                    });
                    return (
                        <div key={single[0]} style={{
                            width: "100%",
                            whiteSpace: "nowrap"
                        }}>
                            <Button onClick={event => {
                                setSearchText("");
                                searchTools("");
                                var draft: tool[];
                                if (isAll) {
                                    draft = realTools;
                                    setSortingFor("__global__");
                                } else {
                                    draft = single[1].map(toolTo => {
                                        var realTool: tool;
                                        realTools.forEach(atool => {
                                            if (atool.to == toolTo) {
                                                realTool = atool;
                                            }
                                        });
                                        return realTool;
                                    });
                                    setSortingFor(single[0]);
                                }
                                setTools(draft);
                            }}>
                                {single[0]}
                            </Button>
                            {(editMode && !isAll) && <IconButton onClick={event => {
                                setDialogOpen(true);
                                setDialogListName(single[0]);
                            }} sx={{
                                position: "absolute",
                                right: "0"
                            }}>
                                <EditIcon />
                            </IconButton>}
                        </div>
                    );
                })}
            </Center>
            <Buttons
                editMode={editMode}
                viewMode={viewMode}
                setEditMode={setEditMode}
                setViewMode={setViewMode}
                editing={searchText === ""}
                setList={setList}
            />
            {dialogOpen && <EditToolsListDialog
                dialogTools={dialogTools}
                setDialogTools={setDialogTools}
                dialogListName={dialogListName}
                setDialogListName={setDialogListName}
                setDialogOpen={setDialogOpen}
                setRemoveDialogOpen={setRemoveDialogOpen}
                setList={setList}
                left={(() => {
                    var realLeft: string[] = [];
                    list.forEach(single => {
                        if (single[0] === dialogListName) {
                            single[1].forEach(to => {
                                realTools.forEach(tool => {
                                    if (tool.to === to) {
                                        realLeft.push(tool.name);
                                    }
                                });
                            });
                        }
                    });
                    return realLeft;
                })()}
            />}
            {removeDialogOpen && <CheckDialog
                title={I18N.get("删除此工具列表")}
                description={I18N.get("确定删除此工具列表吗？")}
                onTrue={() => {
                    var listDraft: lists = list;
                    listDraft.forEach(draftSingle => {
                        if (draftSingle[0] === dialogListName) {
                            listDraft.splice(listDraft.indexOf(draftSingle), 1);
                        }
                    });
                    setList(listDraft);
                    setSetting("lists", "集合列表", JSON.stringify(listDraft));
                    setDialogListName("");
                    return setRemoveDialogOpen(false);
                }}
                onFalse={() => {
                    setDialogListName("");
                    return setRemoveDialogOpen(false);
                }}
            />}
        </Drawer>
    );
}
