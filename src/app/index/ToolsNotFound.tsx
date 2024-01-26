"use client";
import {
    Box,
    Typography
} from "@mui/material";
import {
    SyncProblem as SyncProblemIcon
} from "@mui/icons-material";
import { get } from "react-intl-universal";
export default function ToolsNotFound() {
    return (
        <Box sx={{
            color: theme => theme.palette.text.disabled,
            cursor: "default",
            ["*"]: {
                cursor: "default"
            }
        }}>
            <SyncProblemIcon sx={{
                fontSize: "500%"
            }} />
            <Typography>
                {get("index.notfound")}
            </Typography>
        </Box>
    );
}
