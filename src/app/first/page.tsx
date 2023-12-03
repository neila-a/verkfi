"use client";
import {
    useContext
} from "react";
import {
    Handyman as HandymanIcon
} from "@mui/icons-material";
import {
    Box,
    LinearProgress
} from "@mui/material";
import {
    first as firstContext
} from "../layout/layoutClient";
import type info from "./info";
export default function First() {
    const first = useContext(firstContext),
        infos: info[] = [
            {
                image: <HandymanIcon sx={{
                    fontSize: "1000%"
                }} />,
                title: "verkfi",
                context: ""
            }
        ];
    return (
        <>
            <Box sx={{
                display: "flex",
                flexWrap: "wrap",
                alignContent: "center",
                width: "100vw",
                height: "100vh",
                flexDirection: "column",
                backgroundColor: "#1976d2",
                justifyContent: "space-evenly",
                alignItems: "center"
            }}>
                
            </Box>
        </>
    );
}