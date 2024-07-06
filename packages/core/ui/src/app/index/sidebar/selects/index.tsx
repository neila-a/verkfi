"use client";
import {
    DragDropContext,
    Draggable,
    Droppable
} from "@hello-pangea/dnd";
import {
    DragIndicator as DragIndicatorIcon,
    Edit as EditIcon
} from "@mui/icons-material";
import {
    Box,
    IconButton
} from "@mui/material";
import MouseOverPopover from "@verkfi/shared/Popover";
import {
    useAtom,
    useAtomValue,
    useSetAtom
} from "jotai";
import {
    listsAtom
} from "@verkfi/shared/atoms";
import dynamic from "next/dynamic";
import {
    Fragment,
    ReactNode,
    createElement,
    startTransition,
    useContext
} from "react";
import {
    get
} from "react-intl-universal";
import reorderArray from "reorder-array";
import SingleSelect from "./SingleSelect";
import toolsListAtom from "@verkfi/shared/atoms/toolsList";
import {
    editModeAtom,
    editingAtom,
    searchTextAtom,
    sortedToolsAtom,
    sortingForAtom,
    toolsAtom
} from "index/atoms";
import {
    isImplantContext
} from "index/consts";
import {
    categoryDialogListNameAtom,
    categoryDialogOpenAtom,
    removeDialogOpenAtom
} from "@verkfi/shared/atoms/category";
export default function Selects(props: {
    isSidebar?: boolean;
    modifyClickCount(value: number | "++"): void;
}) {
    const isImplant = useContext(isImplantContext),
        sortingFor = useAtomValue(sortingForAtom)(isImplant),
        setSortingFor = useSetAtom(sortingForAtom),
        setEditing = useSetAtom(editingAtom),
        setSortedTools = useSetAtom(sortedToolsAtom),
        [searchText, setSearchText] = useAtom(searchTextAtom),
        [list, setList] = useAtom(listsAtom),
        setDialogOpen = useSetAtom(categoryDialogOpenAtom),
        gotToolsList = useAtomValue(toolsListAtom),
        [removeDialogOpen, setRemoveDialogOpen] = useAtom(removeDialogOpenAtom),
        [dialogListName, setDialogListName] = useAtom(categoryDialogListNameAtom),
        editMode = useAtomValue(editModeAtom),
        setTools = useSetAtom(toolsAtom);
    function RealSelect(aprops: {
        /**
         * 分类名称
         */
        single: string;
        isAll: boolean;
    }) {
        return <Box>
            <SingleSelect
                dragButton={editMode && !aprops.isAll && <DragIndicatorIcon />}
                isSidebar={Boolean(props.isSidebar)}
                key={aprops.single}
                tool={aprops.single}
                onClick={event => {
                    const publicSet = draft => {
                        setEditing(searchText === "");
                        setSearchText("", isImplant);
                        props.modifyClickCount("++");
                        setSortedTools(draft);
                        startTransition(async () => await setTools(draft));
                    };
                    if (aprops.isAll) {
                        if (sortingFor !== "__global__") {
                            const draft = gotToolsList;
                            props.modifyClickCount(0);
                            setSortingFor("__global__");
                            publicSet(draft);
                        }
                    } else {
                        if (sortingFor !== aprops.single) {
                            const draft = (aprops.isAll ? [] as string[] : list[aprops.single]).map(toolTo => gotToolsList.find(one => one.to === toolTo));
                            if (sortingFor !== aprops.single) {
                                props.modifyClickCount(0);
                            }
                            setSortingFor(aprops.single);
                            publicSet(draft);
                        }
                    }
                }} editButton={(
                    editMode && !aprops.isAll ? <MouseOverPopover text={get("index.editCategory")}>
                        <IconButton onClick={event => {
                            setDialogOpen(true);
                            setDialogListName(aprops.single);
                        }} aria-label={get("index.editCategory")}>
                            <EditIcon />
                        </IconButton>
                    </MouseOverPopover> : <Fragment />
                )} wantSortingFor={aprops.isAll ? "__global__" : aprops.single} />
        </Box>;
    }
    return (
        <Box sx={{
            width: "100%",
            display: props.isSidebar ? "" : "flex",
            justifyContent: "space-evenly",
            alignItems: "center"
        }}>
            <RealSelect single={get("全部")} isAll />
            <DragDropContext onDragEnd={result => {
                if (!result.destination) {
                    return;
                }
                if (result.destination.index === result.source.index) {
                    return;
                }
                if (editMode) {
                    const newLists = reorderArray(list, result.source.index, result.destination.index);
                    return startTransition(() => setList(newLists));
                }
            }}>
                <Droppable direction={props.isSidebar ? "vertical" : "horizontal"} droppableId="categories" isDropDisabled={!editMode}>
                    {provided => <Box ref={provided.innerRef} {...provided.droppableProps} sx={{
                        display: props.isSidebar ? "" : "flex"
                    }}>
                        {Object.keys(list).filter(value => value !== "__global__").map((value, index) => createElement(
                            editMode ? (props: {
                                children: ReactNode;
                            }) => {
                                return <Draggable draggableId={value} index={index} key={value}>
                                    {provided => <Box ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                        {props.children}
                                    </Box>}
                                </Draggable>;
                            } : Fragment,
                            {
                                key: value
                            },
                            <RealSelect single={value} isAll={false} />
                        ))}
                        {provided.placeholder}
                    </Box>
                    }
                </Droppable>
            </DragDropContext>
            {editMode && <> {/* 只有editMode时才会启用，可以用dynamic */}
                {createElement(dynamic(() => import("./EditCategoryDialog")), {
                    left: gotToolsList.filter(tool => {
                        return list[dialogListName]?.includes(tool.to);
                    }).map(tool => tool.name)
                })}
                {createElement(dynamic(() => import("@verkfi/shared/dialog/Check")), {
                    open: removeDialogOpen,
                    title: get("category.删除此分类"),
                    description: get("category.确定删除此分类吗？"),
                    onTrue: () => {
                        const listDraft = structuredClone(list);
                        Reflect.deleteProperty(listDraft, dialogListName);
                        setList(listDraft);
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
