"use client";
import {
    get
} from 'react-intl-universal';
import {
    Box,
    IconButton
} from "@mui/material";
import {
    Edit as EditIcon
} from "@mui/icons-material";
import {
    setState
} from 'declare';
import {
    createElement,
    useContext,
    useState
} from 'react';
import {
    getTools,
    tool
} from "tools/info";
import useToolsList from './getToolsList';
import {
    DragDropContext,
    Draggable,
    Droppable
} from '@hello-pangea/dnd';
import reorderArray from 'reorder-array';
import {
    DragIndicator as DragIndicatorIcon
} from "@mui/icons-material";
import {
    lists as listsContext
} from 'layout/layoutClient';
import MouseOverPopover from 'components/Popover';
import {
    lists
} from './Sidebar';
import SingleSelect from './SingleSelect';
import dynamic from 'next/dynamic';
export default function Selects(props: {
    list: lists;
    setList: setState<lists>;
    setEditing: setState<boolean>;
    sortingFor: string;
    setSortingFor: setState<string>;
    searchText: string;
    setSearchText: setState<string>;
    setSortedTools: setState<tool[]>;
    setTools: setState<tool[]>;
    editMode: boolean;
    setEditMode: setState<boolean>;
    isSidebar?: boolean;
    searchTools(search: string): void;
    modifyClickCount(value: number | "++"): void;
}) {
    const {
        list, setList, setTools, searchTools, searchText, setSearchText, sortingFor, setSortingFor, setEditing
    } = props,
        [dialogOpen, setDialogOpen] = useState<boolean>(false),
        [dialogTools, setDialogTools] = useState<string[]>([]),
        gotToolsList = useToolsList(getTools(get)),
        lists = useContext(listsContext),
        [removeDialogOpen, setRemoveDialogOpen] = useState<boolean>(false),
        [dialogListName, setDialogListName] = useState<string>(""),
        RealSelect = (aprops: {
            single: [string, string[]];
            isAll: boolean;
        }) => (
            <Box>
                <SingleSelect
                    dragButton={props.editMode && !aprops.isAll && <DragIndicatorIcon />}
                    editMode={props.editMode}
                    isSidebar={Boolean(props.isSidebar)}
                    sortingFor={sortingFor}
                    searchText={searchText}
                    key={aprops.single[0]}
                    tool={aprops.single[0]}
                    onClick={event => {
                        const publicSet = draft => {
                            setEditing(props.searchText === "");
                            setSearchText("");
                            searchTools("");
                            props.modifyClickCount("++");
                            props.setSortedTools(draft);
                            setTools(draft);
                        }
                        if (aprops.isAll) {
                            if (sortingFor !== "__global__") {
                                const draft = gotToolsList;
                                props.modifyClickCount(0);
                                setSortingFor("__global__");
                                publicSet(draft);
                            }
                        } else {
                            if (sortingFor !== aprops.single[0]) {
                                const draft = aprops.single[1].map(toolTo => gotToolsList.find(one => one.to === toolTo));
                                if (sortingFor !== aprops.single[0]) {
                                    props.modifyClickCount(0);
                                }
                                setSortingFor(aprops.single[0]);
                                publicSet(draft);
                            }
                        }
                    }} editButton={(
                        (props.editMode && !aprops.isAll) ? (
                            <MouseOverPopover text={get("index.editCategory")}>
                                <IconButton onClick={event => {
                                    setDialogOpen(true);
                                    setDialogListName(aprops.single[0]);
                                }} aria-label={get("index.editCategory")}>
                                    <EditIcon />
                                </IconButton>
                            </MouseOverPopover>
                        ) : <></>
                    )} wantSortingFor={aprops.isAll ? "__global__" : aprops.single[0]} />
            </Box>
        );
    return (
        <Box sx={{
            width: "100%",
            display: Boolean(props.isSidebar) ? "" : "flex",
            justifyContent: "space-evenly",
            alignItems: "center"
        }}>
            <RealSelect single={[get("全部"), []]} isAll />
            <DragDropContext onDragEnd={result => {
                if (!result.destination) {
                    return;
                }
                if (result.destination.index === result.source.index) {
                    return;
                }
                if (props.editMode) {
                    const newLists = reorderArray(props.list, result.source.index, result.destination.index);
                    lists.set(newLists);
                    props.setList(newLists);
                }
            }}>
                <Droppable direction={Boolean(props.isSidebar) ? "vertical" : "horizontal"} droppableId="categories" isDropDisabled={!props.editMode}>
                    {provided => (
                        <Box ref={provided.innerRef} {...provided.droppableProps} sx={{
                            display: Boolean(props.isSidebar) ? "" : "flex"
                        }}>
                            {list.map((value, index) => (
                                props.editMode ? (
                                    <Draggable draggableId={value[0]} index={index} key={value[0]}>
                                        {provided => (
                                            <Box ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                <RealSelect single={value} isAll={false} />
                                            </Box>
                                        )}
                                    </Draggable>
                                ) : <RealSelect key={value[0]} single={value} isAll={false} />
                            ))}
                            {provided.placeholder}
                        </Box>
                    )}
                </Droppable>
            </DragDropContext>
            {props.editMode && <> {/* 只有editMode时才会启用，可以用dynamic */}
                {createElement(dynamic(() => import("./EditToolsListDialog")), {
                    open: dialogOpen,
                    dialogTools,
                    setDialogTools,
                    dialogListName,
                    setDialogListName,
                    setDialogOpen,
                    setRemoveDialogOpen,
                    setList,
                    left: gotToolsList.filter(tool => {
                        const found = list.find(single => single[0] === dialogListName);
                        if (found !== undefined) {
                            return found[1].includes(tool.to);
                        }
                        return false;
                    }).map(tool => tool.name)
                })}
                {createElement(dynamic(() => import("dialog/Check")), {
                    open: removeDialogOpen,
                    title: get("category.删除此分类"),
                    description: get("category.确定删除此分类吗？"),
                    onTrue: () => {
                        var listDraft: lists = list.slice(0).filter(draftSingle => draftSingle[0] !== dialogListName)
                        setList(listDraft);
                        lists.set(listDraft);
                        setDialogListName("");
                        return setRemoveDialogOpen(false);
                    },
                    onFalse: () => {
                        setDialogListName("");
                        return setRemoveDialogOpen(false);
                    }
                })}
            </>}
        </Box>
    );
}
