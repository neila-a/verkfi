"use client";
import {
    SyncProblem as SyncProblemIcon
} from "@mui/icons-material";
import {
    Box,
    Typography
} from "@mui/material";
import {
    ReactNode
} from "react";
export default function No(props: {
    children: ReactNode;
}) {
    return (
        <Box sx={{
            color: theme => theme.palette.text.disabled,
            textAlign: "center",
            cursor: "default",
            ["*"]: {
                cursor: "default"
            }
        }}>
            <SyncProblemIcon sx={{
                fontSize: "500%"
            }} />
            <Typography>
                {props.children}
            </Typography>
        </Box>
    );
}
