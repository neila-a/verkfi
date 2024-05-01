"use client";
import {
    SyncProblem as SyncProblemIcon
} from "@mui/icons-material";
import {
    Box,
    Typography
} from "@mui/material";
export default function No(props: {
    children: string;
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
