"use client";
import {
    useContext
} from 'react';
import {
    Box,
    Collapse,
    Stack
} from "@mui/material";
import {
    tool
} from "../tools/info";
import SingleTool from './SingleTool';
import {
    viewMode
} from './consts';
import {
    setState
} from '../declare';
import {
    DragDropContext,
    Droppable,
    Draggable
} from "@hello-pangea/dnd";
import reorder from '../components/reorder';
import useButtonCommonSorting from './buttonCommonSorting';
import {
    TransitionGroup
} from 'react-transition-group';
import No from '../components/No';
import {
    get
} from 'react-intl-universal';
export default function ToolsStack(props: {
    paramTool: tool[];
    viewMode: viewMode;
    searchText: string;
    sortingFor: string;
    setTools: setState<tool[]>;
    editMode: boolean;
    /**
     * tool.to
     */
    focus?: string;
}) {
    const {
        viewMode
    } = props,
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
                viewMode={viewMode}
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
                    const newTools = reorder(props.paramTool, result.source.index, result.destination.index);
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
        return (
            <TransitionGroup>
                {props.paramTool.map((tool, index) => (
                    <Collapse key={tool.to}>
                        <Insert key={tool.to} tool={tool} index={index} />
                    </Collapse>
                ))}
            </TransitionGroup>
        );
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
                width: viewMode === "list" && "100%"
            }
        }}> {/* 工具总览 */}
            {props.paramTool.length === 0 ? <No>
                {get("index.notfound")}
            </No> : ((viewMode === "list" && props.editMode) ? <ListContainer /> : <GridContainer />)}
        </Stack>
    );
}
