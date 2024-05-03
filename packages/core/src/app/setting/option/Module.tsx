"use client";
import {
    Grid,
    Paper
} from "@mui/material";
import {
    useAtom
} from "jotai";
import {
    sidebarMode
} from "atoms";
import {
    ReactNode
} from "react";
export default function Module(props: {
    children: ReactNode;
    mode: sidebarMode;
}) {
    const [mode, setMode] = useAtom(sidebarMode),
        isThis = props.mode === mode;
    return (
        <Grid item>
            <Paper onClick={event => {
                setMode(props.mode);
            }} sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                boxShadow: theme => isThis && `inset 0 0 0 ${theme.spacing(1)} ${theme.palette.primary[theme.palette.mode]}`,
                borderColor: theme => isThis && theme.palette.primary[theme.palette.mode]
            }}>
                {props.children}
            </Paper>
        </Grid>
    );
}
