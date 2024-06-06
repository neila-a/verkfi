"use client";
import {
    DragDropContext,
    Draggable,
    Droppable
} from "@hello-pangea/dnd";
import {
    Box,
    Collapse,
    Stack
} from "@mui/material";
import No from "@verkfi/shared/No";
import {
    useAtom
} from "jotai";
import {
    viewMode as viewModeAtom
} from "@verkfi/shared/atoms";
import {
    get
} from "react-intl-universal";
import {
    TransitionGroup
} from "react-transition-group";
import reorderArray from "reorder-array";
import {
    tool
} from "tools/info";
import useButtonCommonSorting from "../sorting/buttonCommonSorting";
import SingleTool from "./SingleTool";
import {
    editModeAtom,
    sortingForAtom,
    toolsAtom
} from "index/atoms";
import {
    ReactNode,
    useContext
} from "react";
import {
    isImplantContext
} from "index/consts";
import {
    useResetAtom
} from "jotai/utils";
export default function ToolsStack(props: {
    paramTool: tool[];
    actions?: ReactNode[];
    notfound?: ReactNode;
    disableClick?: boolean;
    /**
     * tool.to
     */
    focus?: string;
}) {
    const [viewMode] = useAtom(viewModeAtom),
        isImplant = useContext(isImplantContext),
        resetTools = useResetAtom(toolsAtom),
        [editMode] = useAtom(editModeAtom),
        sortingFor = useAtom(sortingForAtom)[0](isImplant),
        buttonCommonSorting = useButtonCommonSorting();
    function Insert({
        index,
        tool
    }: {
        index: number;
        tool: tool;
    }) {
        return (
            <SingleTool
                disableClick={props.disableClick}
                tool={tool}
                key={tool.to}
                actions={props?.actions?.[index]}
                focus={props.focus === tool.to}
            />
        );
    }
    function ListContainer() {
        return (
            <DragDropContext onDragEnd={result => {
                if (!result.destination) {
                    return;
                }
                if (result.destination.index === result.source.index) {
                    return;
                }
                if (editMode) {
                    const newTools = reorderArray(props.paramTool, result.source.index, result.destination.index);
                    buttonCommonSorting(sortingFor, newTools);
                    resetTools();
                }
            }}>
                <Box sx={{
                    width: "100%"
                }}>
                    <Droppable droppableId="toolslist" isDropDisabled={!editMode}>
                        {provided => {
                            return (
                                <Box ref={provided.innerRef} {...provided.droppableProps}>
                                    <TransitionGroup>
                                        {props.paramTool.map((tool, index) => (
                                            <Collapse key={tool.to} sx={{
                                                width: "100%"
                                            }}>
                                                <Draggable draggableId={tool.to} index={index}>
                                                    {provided => (
                                                        <Box ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                            <Insert index={index} tool={tool} />
                                                        </Box>
                                                    )}
                                                </Draggable>
                                            </Collapse>
                                        ))}
                                    </TransitionGroup>
                                    {provided.placeholder}
                                </Box>
                            );
                        }}
                    </Droppable>
                </Box>
            </DragDropContext>
        );
    }
    function GridContainer() {
        return props.paramTool.map((tool, index) => (
            <Insert key={tool.to} tool={tool} index={index} />
        ));
    }
    return (
        <Stack spacing={viewMode === "list" ? 3 : 5} sx={{
            flexDirection: viewMode === "grid" && "row",
            display: viewMode === "grid" && "flex",
            width: "100%",
            flexWrap: "wrap",
            alignContent: "center",
            alignItems: "flex-end",
            justifyContent: "space-evenly",
            textAlign: "center",
            ["& *"]: {
                cursor: "pointer"
            },
            ["& > *"]: {
                width: viewMode === "list" ? "100%" : "unset"
            }
        }}> {/* 工具总览 */}
            {props.paramTool.length === 0 ? (props?.notfound || (
                <No>
                    {get("index.notfound")}
                </No>
            )) : ((viewMode === "list" && editMode) ? <ListContainer /> : <GridContainer />)}
        </Stack>
    );
}
