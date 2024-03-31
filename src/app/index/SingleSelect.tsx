"use client";
import {
    Box,
    Button
} from "@mui/material";
import {
    MouseEventHandler,
    ReactNode
} from 'react';
export default function SingleSelect(props: {
    tool: string;
    onClick: MouseEventHandler<HTMLButtonElement>;
    editButton: ReactNode;
    dragButton: ReactNode;
    wantSortingFor?: string;
    sortingFor: string;
    searchText: string;
    isSidebar: boolean;
    editMode: boolean;
}) {
    const Inner = () => (
        <Box sx={{
            maxWidth: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: theme => props.sortingFor === props.wantSortingFor && theme.palette.action.active
        }}>
            {props.dragButton}
            <Button aria-label={props.tool} sx={{
                overflow: "hidden",
                color: theme => props.sortingFor === props.wantSortingFor && theme.palette.primary[theme.palette.mode]
            }} onClick={event => {
                if (!props.editMode) {
                    props.onClick(event);
                }
            }}>
                {props.tool}
            </Button>
            {props.editButton}
        </Box>
    )
    return props.isSidebar ? (
        <Box sx={{
            width: "100%",
            whiteSpace: "nowrap",
            display: "flex",
            justifyContent: "center",
            ["& > *"]: {
                width: "100%"
            }
        }}>
            <Inner />
        </Box>
    ) : (
        <Inner />
    );
}
