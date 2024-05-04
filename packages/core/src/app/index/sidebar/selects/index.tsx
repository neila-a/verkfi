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
import MouseOverPopover from "components/Popover";
import {
    setState
} from "declare";
import {
    useAtom
} from "jotai";
import {
    lists as listsAtom
} from "atoms";
import dynamic from "next/dynamic";
import {
    Fragment,
    createElement,
    useContext,
    useState
} from "react";
import {
    get
} from "react-intl-universal";
import reorderArray from "reorder-array";
import toolsInfoAtom, {
    tool
} from "tools/info";
import {
    lists
} from "..";
import SingleSelect from "./SingleSelect";
import toolsListAtom from "atoms/toolsList";
import {
    editModeAtom,
    editingAtom,
    searchTextAtom,
    sortingForAtom,
    toolsAtom
} from "index/atoms";
import {
    isImplantContext
} from "index/consts";
export default function Selects(props: {
    setSortedTools: setState<tool[]>;
    isSidebar?: boolean;
    searchTools(search: string): void;
    modifyClickCount(value: number | "++"): void;
}) {
    const
        {
            searchTools
        } = props,
        isImplant = useContext(isImplantContext),
        sortingFor = useAtom(sortingForAtom)[0](isImplant),
        setSortingFor = useAtom(sortingForAtom)[1],
        [, setEditing] = useAtom(editingAtom),
        [searchText, setSearchText] = useAtom(searchTextAtom),
        [list, setList] = useAtom(listsAtom),
        [dialogOpen, setDialogOpen] = useState<boolean>(false),
        [dialogTools, setDialogTools] = useState<string[]>([]),
        [gotToolsList] = useAtom(toolsListAtom),
        [removeDialogOpen, setRemoveDialogOpen] = useState<boolean>(false),
        [dialogListName, setDialogListName] = useState<string>(""),
        [editMode] = useAtom(editModeAtom),
        setTools = useAtom(toolsAtom)[1],
        RealSelect = (aprops: {
            single: [string, string[]];
            isAll: boolean;
        }) => (
            <Box>
                <SingleSelect
                    dragButton={editMode && !aprops.isAll && <DragIndicatorIcon />}
                    isSidebar={Boolean(props.isSidebar)}
                    key={aprops.single[0]}
                    tool={aprops.single[0]}
                    onClick={event => {
                        const publicSet = draft => {
                            setEditing(searchText === "");
                            setSearchText("");
                            searchTools("");
                            props.modifyClickCount("++");
                            props.setSortedTools(draft);
                            setTools(draft);
                        };
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
                        (editMode && !aprops.isAll) ? (
                            <MouseOverPopover text={get("index.editCategory")}>
                                <IconButton onClick={event => {
                                    setDialogOpen(true);
                                    setDialogListName(aprops.single[0]);
                                }} aria-label={get("index.editCategory")}>
                                    <EditIcon />
                                </IconButton>
                            </MouseOverPopover>
                        ) : <Fragment />
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
                if (editMode) {
                    const newLists = reorderArray(list, result.source.index, result.destination.index);
                    setList(newLists);
                }
            }}>
                <Droppable direction={Boolean(props.isSidebar) ? "vertical" : "horizontal"} droppableId="categories" isDropDisabled={!editMode}>
                    {provided => (
                        <Box ref={provided.innerRef} {...provided.droppableProps} sx={{
                            display: Boolean(props.isSidebar) ? "" : "flex"
                        }}>
                            {list.filter(value => value[0] !== "__global__").map((value, index) => (
                                editMode ? (
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
            {editMode && (
                <> {/* 只有editMode时才会启用，可以用dynamic */}
                    {createElement(dynamic(() => import("./EditToolsListDialog")), {
                        open: dialogOpen,
                        dialogTools,
                        setDialogTools,
                        dialogListName,
                        setDialogListName,
                        setDialogOpen,
                        setRemoveDialogOpen,
                        left: gotToolsList.filter(tool => {
                            return list.find(single => single[0] === dialogListName)?.[1]?.includes(tool.to);
                        }).map(tool => tool.name)
                    })}
                    {createElement(dynamic(() => import("dialog/Check")), {
                        open: removeDialogOpen,
                        title: get("category.删除此分类"),
                        description: get("category.确定删除此分类吗？"),
                        onTrue: () => {
                            const listDraft: lists = list.slice(0).filter(draftSingle => draftSingle[0] !== dialogListName);
                            setList(listDraft);
                            setDialogListName("");
                            return setRemoveDialogOpen(false);
                        },
                        onFalse: () => {
                            setDialogListName("");
                            return setRemoveDialogOpen(false);
                        }
                    })}
                </>
            )}
        </Box>
    );
}
