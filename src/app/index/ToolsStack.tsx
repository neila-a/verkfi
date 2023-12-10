"use client";
import {
    get
} from 'react-intl-universal';
import {
    ReactNode,
    useContext
} from 'react';
import {
    Box,
    Collapse,
    Stack
} from "@mui/material";
import style from "./Index.module.scss";
import {
    tool
} from "../tools/info";
import SingleTool from './SingleTool';
import {
    viewMode
} from './consts';
import stringToBoolean from '../setting/stringToBoolean';
import {
    setState
} from '../declare';
import {
    DragDropContext,
    Droppable,
    Draggable
} from "@hello-pangea/dnd";
import {
    darkMode as darkModeContext
} from '../layout/layoutClient';
import reorder from '../components/reorder';
import buttonCommonSorting from './buttonCommonSorting';
import ToolsNotFound from './ToolsNotFound';
import {
    TransitionGroup
} from 'react-transition-group';
export default function ToolsStack(props: {
    paramTool: tool[];
    viewMode: viewMode;
    searchText: string;
    sortingFor: string;
    setTools: setState<tool[]>;
    editMode: boolean;
}) {
    const {
        viewMode
    } = props;
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
                darkMode={darkMode}
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
                                <div ref={provided.innerRef} {...provided.droppableProps}>
                                    <TransitionGroup>
                                        {props.paramTool.map((tool, index) => (
                                            <Collapse key={tool.to}>
                                                <Draggable draggableId={tool.to} index={index}>
                                                    {provided => (
                                                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                            <Insert index={index} tool={tool} />
                                                        </div>
                                                    )}
                                                </Draggable>
                                            </Collapse>
                                        ))}
                                    </TransitionGroup>
                                    {provided.placeholder}
                                </div>
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
    var darkModeFormStorage = useContext(darkModeContext).mode,
        darkMode = stringToBoolean(darkModeFormStorage.replace("light", "false").replace("dark", "true"));
    return (
        <Stack spacing={viewMode == "list" ? 3 : 5} className={style["items"]} sx={{
            flexDirection: viewMode == "grid" ? "row" : "",
            display: viewMode == "grid" ? "flex" : "block",
            width: "100%"
        }}> {/* 工具总览 */}
            {props.paramTool.length === 0 ? <ToolsNotFound /> : ((viewMode === "list" && props.editMode) ? <ListContainer /> : <GridContainer />)}
        </Stack>
    );
}
