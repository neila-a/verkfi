"use client";
import {
    DragDropContext,
    Draggable,
    Droppable
} from "@hello-pangea/dnd";
import {
    Box,
    Collapse
} from "@mui/material";
import {
    useAtomValue,
    useSetAtom
} from "jotai";
import {
    buttonCommonSorterAtom
} from "@verkfi/shared/atoms";
import {
    TransitionGroup
} from "react-transition-group";
import reorderArray from "reorder-array";
import {
    tool
} from "tools/info";
import SingleTool from "./SingleTool";
import {
    editModeAtom,
    sortingForAtom,
    toolsAtom
} from "index/atoms";
import {
    ReactNode,
    startTransition,
    useContext
} from "react";
import {
    isImplantContext
} from "index/consts";
import {
    useResetAtom
} from "jotai/utils";
import ToolsStack from "./ToolsStack";
export const listSpacing = 3,
    gridSpacing = 5;
export default function ToolsStackWithTools(props: {
    paramTool: tool[];
    actions?: ReactNode[];
    notfound?: ReactNode;
    disableClick?: boolean;
    /**
     * tool.to
     */
    focus?: string;
}) {
    const isImplant = useContext(isImplantContext),
        editMode = useAtomValue(editModeAtom),
        sortingFor = useAtomValue(sortingForAtom)(isImplant),
        buttonCommonSorting = useSetAtom(buttonCommonSorterAtom);
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
                    startTransition(async () => {
                        return await buttonCommonSorting(sortingFor, newTools);
                    });
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
                                        {props.paramTool.map((tool, index) => <Collapse key={tool.to} sx={{
                                            width: "100%"
                                        }}>
                                            <Draggable draggableId={tool.to} index={index}>
                                                {provided => <Box ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                    <Insert index={index} tool={tool} />
                                                </Box>}
                                            </Draggable>
                                        </Collapse>
                                        )}
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
        return props.paramTool.map((tool, index) => <Insert key={tool.to} tool={tool} index={index} />);
    }
    return <ToolsStack {...props} GridContainer={GridContainer} ListContainer={ListContainer} />;
}
