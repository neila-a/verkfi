"use client";
import {
    MouseEventHandler,
    useContext,
    useState
} from "react";
import {
    Box,
    Button,
    Collapse,
    IconButton,
    Stack,
    Typography
} from "@mui/material";
import {
    first as firstContext
} from "../layout/layoutClient";
import type info from "./info";
import {
    ArrowBack,
    ArrowForward
} from "@mui/icons-material";
import {
    get
} from "react-intl-universal";
import FeatureIcon from "./featureIcon";
import DevicesIcon from "./devicesIcon";
import {
    useRouter
} from "next/navigation";
import VerkfiIcon from "../components/verkfiIcon/verkfiIcon";
export default function First() {
    const first = useContext(firstContext),
        [step, setStep] = useState<number>(0),
        router = useRouter(),
        infos: info[] = [
            {
                image: <VerkfiIcon sx={{
                    fontSize: "2000%"
                }} />,
                title: get("first.infos.start.title"),
                context: get("first.infos.start.context")
            },
            {
                image: <FeatureIcon sx={{
                    fontSize: "2000%"
                }} />,
                context: get("first.infos.middle.context")
            },
            {
                image: <DevicesIcon sx={{
                    fontSize: "2000%"
                }} />,
                context: get("first.infos.end.context")
            }
        ],
        currentInfo = infos[step],
        preventer: MouseEventHandler = event => {
            event.preventDefault();
        };
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
            }} id="context-container" onClick={event => {
                const leftInstance = event.screenX,
                    rightInstance = event.screenY,
                    elementWidth = Number(window.getComputedStyle(document.getElementById("context-container")).width.replace("px", ""));
                if (leftInstance < (elementWidth / 2)) {
                    setStep(old => Math.max(0, old - 1));
                } else {
                    setStep(old => Math.min(infos.length - 1, old + 1));
                }
            }}>
                <Box onClick={preventer}>
                    <Collapse key={currentInfo.context} orientation="horizontal" in={true}>
                        {currentInfo.image}
                    </Collapse>
                </Box>
                <Stack onClick={preventer} spacing={3} sx={{
                    textAlign: "center"
                }}>
                    {step === 0 && <Typography variant="h3">
                        {currentInfo.title}
                    </Typography>}
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
                <Button variant="contained" onClick={event => {
                    first.set("false");
                    router.push("/");
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