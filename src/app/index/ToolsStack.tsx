"use client";
import I18N from 'react-intl-universal';
import {
    useContext
} from 'react';
import {
    Stack,
    Typography
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
} from '../layoutClient';
import reorder from '../components/reorder';
import setSetting from '../setting/setSetting';
import buttonCommonSorting from './buttonCommonSorting';
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
    var darkModeFormStorage = useContext(darkModeContext).mode,
        darkMode = stringToBoolean(darkModeFormStorage.replace("light", "false").replace("dark", "true"));
    return (
        <Stack spacing={viewMode == "list" ? 3 : 5} className={style["items"]} sx={{
            flexDirection: viewMode == "grid" ? "row" : "",
            display: viewMode == "grid" ? "flex" : "block",
            width: "100%"
        }}> {/* 工具总览 */}
            {props.paramTool.length === 0 ? <Typography>{I18N.get('未找到任何工具')}</Typography> : (viewMode === "list" ? <DragDropContext onDragEnd={result => {
                if (!result.destination) {
                    return;
                }
                if (result.destination.index === result.source.index) {
                    return;
                }
                console.log(props.editMode)
                if (props.editMode) {
                    const newTools = reorder(props.paramTool, result.source.index, result.destination.index);
                    buttonCommonSorting(props.sortingFor, newTools);
                    props.setTools(newTools);
                }
            }}>
                <Droppable droppableId="toolslist" isDropDisabled={!props.editMode}>
                    {provided => {
                        return (
                            <div ref={provided.innerRef} {...provided.droppableProps}>
                                {props.paramTool.map((tool, index) => (
                                    <Draggable draggableId={tool.to} index={index} key={tool.to}>
                                        {provided => (
                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                <SingleTool
                                                    isFirst={(props.searchText !== "") && (index === 0)}
                                                    tool={tool}
                                                    sortingFor={props.sortingFor}
                                                    key={tool.to}
                                                    darkMode={darkMode}
                                                    viewMode={viewMode}
                                                    setTools={props.setTools}
                                                    editMode={props.editMode} />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        );
                    }}
                </Droppable>
            </DragDropContext> : props.paramTool.map((tool, index) => (
                <SingleTool
                    isFirst={(props.searchText !== "") && (index === 0)}
                    tool={tool}
                    sortingFor={props.sortingFor}
                    key={tool.to}
                    darkMode={darkMode}
                    viewMode={viewMode}
                    setTools={props.setTools}
                    editMode={props.editMode} />
            )))}
        </Stack>
    );
}
