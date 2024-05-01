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
import No from 'No';
import {
    setState
} from 'declare';
import {
    useAtom
} from "jotai";
import {
    viewMode as viewModeAtom
} from "layout/layoutClient";
import {
    get
} from 'react-intl-universal';
import {
    TransitionGroup
} from 'react-transition-group';
import reorderArray from 'reorder-array';
import {
    tool
} from "tools/info";
import useButtonCommonSorting from '../sorting/buttonCommonSorting';
import SingleTool from './SingleTool';
export default function ToolsStack(props: {
    paramTool: tool[];
    searchText: string;
    sortingFor: string;
    setTools: setState<tool[]>;
    editMode: boolean;
    /**
     * tool.to
     */
    focus?: string;
}) {
    const [viewMode] = useAtom(viewModeAtom),
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
                isFirst={(props.searchText !== "") && (index === 0)}
                tool={tool}
                sortingFor={props.sortingFor}
                key={tool.to}
                focus={props.focus === tool.to}
                setTools={props.setTools}
                editMode={props.editMode} />
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
                if (props.editMode) {
                    const newTools = reorderArray(props.paramTool, result.source.index, result.destination.index);
                    buttonCommonSorting(props.sortingFor, newTools);
                    props.setTools(newTools);
                }
            }}>
                <Box sx={{
                    width: "100%"
                }}>
                    <Droppable droppableId="toolslist" isDropDisabled={!props.editMode}>
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
        <Stack spacing={viewMode == "list" ? 3 : 5} sx={{
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
            {props.paramTool.length === 0 ? (
                <No>
                    {get("index.notfound")}
                </No>
            ) : ((viewMode === "list" && props.editMode) ? <ListContainer /> : <GridContainer />)}
        </Stack>
    );
}
