"use client";
import {
    useContext,
    useState
} from "react";
import {
    Handyman as HandymanIcon
} from "@mui/icons-material";
import {
    Box,
    LinearProgress,
    Typography
} from "@mui/material";
import {
    first as firstContext
} from "../layout/layoutClient";
import type info from "./info";
export default function First() {
    const first = useContext(firstContext),
        [step, setStep] = useState<number>(0),
        infos: info[] = [
            {
                image: <HandymanIcon sx={{
                    fontSize: "1000%"
                }} />,
                title: "Verkfi",
                context: ""
            }
        ],
        currentInfo = infos[step];
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
                {currentInfo.image}
                <Box>
                    <Typography variant="h2">
                        {currentInfo.title}
                    </Typography>
                    <Typography variant="body1">
                        {currentInfo.context}
                    </Typography>
                </Box>
            </Box>
        </>
    );
}