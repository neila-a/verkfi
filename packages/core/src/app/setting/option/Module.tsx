"use client";
import {
    Paper,
    Grid
} from "@mui/material";
import {
    sidebarMode
} from "layout/layoutClient";
import {
    ReactNode,
    useContext
} from "react";
export default function Module(props: {
    children: ReactNode;
    mode: sidebarMode;
}) {
    const mode = useContext(sidebarMode),
        isThis = props.mode === mode.value;
    return (
        <Grid item>
            <Paper onClick={event => {
                mode.set(props.mode);
            }} sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                boxShadow: theme => isThis && `inset 0 0 0 8px ${theme.palette.primary[theme.palette.mode]}`,
                borderColor: theme => isThis && theme.palette.primary[theme.palette.mode]
            }}>
                {props.children}
            </Paper>
        </Grid>
    );
}
