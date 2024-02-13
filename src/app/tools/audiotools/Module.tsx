"use client";
import {
    Paper,
    PaperOwnProps
} from "@mui/material";
const Module = (props: PaperOwnProps) => <Paper {...props} sx={{
    ...props.sx,
    p: 1
}} />;
export default Module;
