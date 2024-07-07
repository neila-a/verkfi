"use client";
import {
    ImageListItem,
    Typography
} from "@mui/material"
import {
    get
} from "react-intl-universal"
import RecentsArray from "./array"
export default function Recents() {
    return <>
        <ImageListItem key="Subheader">
            <Typography variant="h4">
                {get("jigsaw.recent")}
            </Typography>
        </ImageListItem>
        <RecentsArray />
    </>;
}