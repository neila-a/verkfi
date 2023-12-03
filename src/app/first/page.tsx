"use client";
import {
    useContext,
    useState
} from "react";
import {
    Box,
    Button,
    IconButton,
    Stack,
    Typography
} from "@mui/material";
import {
    first as firstContext
} from "../layout/layoutClient";
import {
    Handyman as HandymanIcon
} from "@mui/icons-material";
import type info from "./info";
import {
    ArrowBack,
    ArrowForward
} from "@mui/icons-material";
import {
    get
} from "react-intl-universal";
import EarthIcon from "./earthIcon";
export default function First() {
    const first = useContext(firstContext),
        [step, setStep] = useState<number>(0),
        infos: info[] = [
            {
                image: <HandymanIcon sx={{
                    fontSize: "2000%"
                }} />,
                title: "Verkfi",
                context: get("first.infos.start.context")
            },
            {
                image: <EarthIcon sx={{
                    fontSize: "2000%"
                }} />,
                title: get("first.infos.middle.title"),
                context: get("first.infos.middle.context")
            }
        ],
        currentInfo = infos[step];
    return (
        <>
            <Stack sx={{
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
                <Stack spacing={3} sx={{
                    textAlign: "center"
                }}>
                    <Typography variant="h3">
                        {currentInfo.title}
                    </Typography>
                    <Typography variant="h6">
                        {currentInfo.context}
                    </Typography>
                </Stack>
            </Stack>
            <Box mb={2} sx={{
                position: "absolute",
                bottom: "0",
                width: "100%",
                display: "flex",
                justifyContent: "space-between"
            }}>
                <IconButton size="large" edge="start" color="inherit" aria-label="back" sx={{
                    ml: 2
                }} disabled={step === 0} onClick={event => {
                    setStep(old => old - 1);
                }}>
                    <ArrowBack />
                </IconButton>
                <Button variant="contained" onClick={() => {

                }}>
                    {get("first.现在开始")}
                </Button>
                <IconButton size="large" edge="end" color="inherit" aria-label="forward" sx={{
                    mr: 2
                }} disabled={step + 1 === infos.length} onClick={event => {
                    setStep(old => old + 1);
                }}>
                    <ArrowForward />
                </IconButton>
            </Box>
        </>
    );
}