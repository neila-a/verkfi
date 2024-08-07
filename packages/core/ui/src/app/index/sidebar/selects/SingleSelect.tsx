"use client";
import {
    Box,
    Button
} from "@mui/material";
import {
    sorting,
    sortingForAtom
} from "index/atoms";
import {
    isImplantContext
} from "index/consts";
import {
    useAtomValue
} from "jotai";
import {
    MouseEventHandler,
    ReactNode,
    useContext
} from "react";
export default function SingleSelect(props: {
    tool: string;
    onClick: MouseEventHandler<HTMLButtonElement>;
    editButton: ReactNode;
    dragButton: ReactNode;
    wantSortingFor?: sorting;
    isSidebar: boolean;
}) {
    const isImplant = useContext(isImplantContext),
        sortingFor = useAtomValue(sortingForAtom)(isImplant),
        Inner = () => <Box sx={{
            maxWidth: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: theme => sortingFor === props.wantSortingFor && theme.palette.action.active
        }}>
            {props.dragButton}
            <Button aria-label={props.tool} sx={{
                overflow: "hidden",
                color: theme => sortingFor === props.wantSortingFor && theme.palette.primary[theme.palette.mode]
            }} onClick={props.onClick}>
                {props.tool}
            </Button>
            {props.editButton}
        </Box>;
    return props.isSidebar ? <Box sx={{
        width: "100%",
        whiteSpace: "nowrap",
        display: "flex",
        justifyContent: "center",
        ["& > *"]: {
            width: "100%"
        }
    }}>
        <Inner />
    </Box> : <Inner />;
}
