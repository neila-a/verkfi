"use client";
import {
    Button, Paper
} from "@mui/material";
import {
    setState
} from '../declare';
import {
    MouseEventHandler,
    ReactNode
} from 'react';
export default function SingleSelect(props: {
    tool: string;
    onClick: MouseEventHandler<HTMLButtonElement>;
    editButton: ReactNode;
    wantSortingFor?: string;
    sortingFor: string;
    searchText: string;
    isSidebar: boolean;
    setEditing: setState<boolean>;
}) {
    const Inner = () => (
        <>
            <Button aria-label={props.tool} fullWidth sx={{
                bgcolor: theme => props.sortingFor === props.wantSortingFor ? theme.palette.action.active : "",
                color: theme => props.sortingFor === props.wantSortingFor ? theme.palette.primary[theme.palette.mode] : ""
            }} onClick={event => {
                props.setEditing(props.searchText === "");
                props.onClick(event);
            }}>
                {props.tool}
            </Button>
            {props.editButton}
        </>
    )
    return props.isSidebar ? (
        <div style={{
            width: "100%",
            whiteSpace: "nowrap"
        }}>
            <Inner />
        </div>
    ) : (
        <Inner />
    );
}
