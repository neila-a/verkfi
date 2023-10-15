"use client";
import I18N from 'react-intl-universal';
import {
    drawerWidth
} from '../setting/consts';
import {
    IconButton,
    InputBase,
    Paper,
    Drawer,
    Toolbar,
    Button,
    useTheme
} from "@mui/material";
import {
    Edit as EditIcon,
    Search as SearchIcon
} from "@mui/icons-material";
import MouseOverPopover from "../components/Popover";
import Buttons from './Buttons';
import {
    Hex,
    setState
} from '../declare';
import {
    viewMode
} from './consts';
import {
    MouseEventHandler,
    ReactNode,
    useEffect,
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
import dynamic from 'next/dynamic';
const EditToolsListDialog = dynamic(() => import("./EditToolsListDialog"));
const CheckDialog = dynamic(() => import("../components/dialog/CheckDialog"));
import setSetting from '../setting/setSetting';
import Image from 'next/image';
import {
    useLiveQuery
} from 'dexie-react-hooks';
import db from '../extendedTools/db';
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
    } = props;
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
        [dialogListName, setDialogListName] = useState<string>(""),
        [editing, setEditing] = useState<boolean>(searchText === ""),
        clickCount = 0;
    const extendedTools = useLiveQuery(() => db.extendedTools.toArray()),
        convertedExtendedTools: tool[] = extendedTools?.map(single => ({
            name: single.name,
            to: `/extendedTools?id=${single.to}` as Lowercase<string>,
            desc: single.desc,
            icon: () => <Image src={single.icon} alt={single.name} height={24} width={24} />,
            color: single.color as [Hex.Hex, Hex.Hex],
            isGoto: true
        }));
    function SingleSelect(props: {
        tool: string;
        onClick: MouseEventHandler<HTMLButtonElement>;
        editButton: ReactNode;
        wantSortingFor?: string;
    }) {
        return (
            <div style={{
                width: "100%",
                whiteSpace: "nowrap"
            }}>
                <Button aria-label={props.tool} fullWidth sx={{
                    bgcolor: theme => sortingFor === props.wantSortingFor ? theme.palette.action.active : "",
                    color: theme => sortingFor === props.wantSortingFor ? theme.palette.primary[theme.palette.mode] : ""
                }} onClick={event => {
                    setEditing(searchText === "");
                    props.onClick(event);
                }}>
                    {props.tool}
                </Button>
                {props.editButton}
            </div>
        );
    }
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
                {!props.isImplant && <SingleSelect wantSortingFor="__home__" tool={I18N.get("主页")} onClick={event => {
                    props.setShow("home");
                    setSortingFor("__home__");
                }} editButton={<></>} />}
                <div onClick={event => {
                    props.setShow("tools");
                    props.setExpand(true);
                    if (clickCount === 1) {
                        props.setExpand(false);
                        clickCount = 0;
                    }
                }}>
                    {([[I18N.get("全部"), getToolsList(getTools(I18N)).map(atool => atool.to)]] as lists).concat(list).map(single => {
                        const isAll = Object.values(locales).some(singleLang => {
                            const strings = Object.values(singleLang);
                            let have: boolean = strings.includes(single[0]);
                            return have;
                        });
                        return (
                            <>
                                <SingleSelect key={single[0]} tool={single[0]} onClick={event => {
                                    setEditing(true);
                                    setSearchText("");
                                    searchTools("");
                                    let draft: tool[] = [];
                                    clickCount++;
                                    if (isAll) {
                                        draft = getToolsList(getTools(I18N));
                                        if (sortingFor !== "__global__") {
                                            clickCount = 0;
                                        }
                                        setSortingFor("__global__");
                                    } else {
                                        draft = single[1].map(toolTo => getToolsList(getTools(I18N)).filter(one => one.to === toolTo)[0]);
                                        if (sortingFor !== single[0]) {
                                            clickCount = 0;
                                        }
                                        setSortingFor(single[0]);
                                    }
                                    props.setSortedTools(draft);
                                    setTools(draft);
                                }} editButton={(
                                    (editMode && !isAll) ? <IconButton onClick={event => {
                                        setDialogOpen(true);
                                        setDialogListName(single[0]);
                                    }} sx={{
                                        position: "absolute",
                                        right: "0"
                                    }}>
                                        <EditIcon />
                                    </IconButton> : <></>
                                )} wantSortingFor={isAll ? "__global__" : single[0]} />
                            </>
                        );
                    })}
                    <SingleSelect wantSortingFor="__extended__" tool={I18N.get("扩展工具")} onClick={event => {
                        clickCount++;
                        if (sortingFor !== "__extended__") {
                            clickCount = 0;
                        }
                        setSortingFor("__extended__");
                        setEditing(false);
                        props.setSortedTools(convertedExtendedTools);
                        setTools(convertedExtendedTools);
                    }} editButton={<></>} />
                </div>
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
                                getToolsList(getTools(I18N)).forEach(tool => {
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
