"use client";
import {
    Download,
    PlayArrow,
    Stop
} from "@mui/icons-material";
import {
    Box,
    Button,
    ButtonGroup,
    Container,
    List,
    ListItem,
    ListItemText,
    Typography
} from "@mui/material";
import InputDialog from "@verkfi/shared/dialog/Input";
import {
    saveAs
} from "file-saver";
import isBrowser from "@verkfi/shared/isBrowser";
import dynamic from "next/dynamic";
import {
    useEffect,
    useRef,
    useState
} from "react";
import {
    get
} from "react-intl-universal";
import getRecording from "@verkfi/shared/getRecording";
import {
    status
} from "@verkfi/tool-audiotools";
import getShortTimeEnergy from "./getShortTimeEnergy";
const PureDialog = dynamic(() => import("@verkfi/shared/dialog/Pure"));
interface warning {
    /**
     * 发生时间
     */
    0: number;

    /**
     * 持续时间
     */
    1: number;
}
const NoiseVoiceWatershedWave = 20, // origin 2.3
    SpeechingWatershedWave = 15, // if it didn't speech in 15 seconds, it throws a warning
    defaultSpeechTime = 600,
    secondDivMS = 1000,
    vibrateTimes = 4,
    vibrateTime = 250;
export default function Speech() {
    const [status, setStatus] = useState<status>("inactive"),
        mediaRecorder = useRef<"awaqwq" | MediaRecorder>("awaqwq"),
        intervalID = useRef<number>(0),
        speechTimeIntervalID = useRef<number>(0),
        haveTime = useRef<number>(Date.now()),
        [countdown, setCountdown] = useState<number>(0),
        [showWarning, setShowWarning] = useState<boolean>(false),
        [selectTime, setSelectTime] = useState<boolean>(false),
        [speechTime, setSpeechTime] = useState<number>(defaultSpeechTime),
        [allSpeechTime, setAllSpeechTime] = useState<number>(defaultSpeechTime),
        [warnings, setWarnings] = useState<warning[]>([]),
        audioFile = useRef<Blob>(new Blob(["Why you downloaded this??? Do not do it!!!"]));
    if (isBrowser()) {
        getRecording(blob => {
            audioFile.current = new Blob([blob]);
        }, async blob => {
            const context = new AudioContext(),
                energy = getShortTimeEnergy(await context.decodeAudioData(await blob.arrayBuffer()).then(buffer => buffer.getChannelData(0))),
                avg = energy.reduce((a, b) => a + b) / energy.length,
                watershed = Math.max(...energy) / avg,
                have = watershed < NoiseVoiceWatershedWave;
            if (have) {
                haveTime.current = Date.now();
            }
        }).then(recording => {
            mediaRecorder.current = recording;
        });
    }
    useEffect(() => {
        return () => {
            clearInterval(intervalID.current);
            clearInterval(speechTimeIntervalID.current);
        };
    }, []);
    function intervaler() {
        const time = Math.floor((Date.now() - haveTime.current) / secondDivMS);
        if ("vibrate" in window.navigator) {
            if (time > SpeechingWatershedWave) {
                window.navigator.vibrate(Array(vibrateTimes).fill(vibrateTime));
                setWarnings(old => {
                    if (old.some(singleWarning => singleWarning[0] === haveTime.current)) {
                        return old.slice(0).map(singleWarning => {
                            if (singleWarning[0] === haveTime.current) {
                                return [singleWarning[0], time];
                            }
                            return singleWarning;
                        });
                    }
                    const realOld = old.slice(0);
                    realOld.push([haveTime.current, time]);
                    return realOld;
                });
            } else {
                window.navigator.vibrate(0);
            }
        }
        setCountdown(time);
    }
    function timeIntervaler() {
        if (speechTime > -1) {
            setSpeechTime(old => old - 1);
        }
    }
    return (
        <Container sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "80vh"
        }}>
            <Typography variant="subtitle1" sx={{
                mb: 2
            }}>
                {get("speech.noSayTime")}
            </Typography>
            <Typography variant="h1" component="p" sx={{
                fontSize: "33vw",
                color: theme => countdown > SpeechingWatershedWave ? theme.palette.error.main : theme.palette.primary.main
            }}>
                {countdown}
            </Typography>
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
            }}>
                <Typography variant="subtitle1" sx={{
                    mb: 2
                }}>
                    {get("speech.tip", {
                        all: allSpeechTime,
                        time: speechTime
                    })}
                </Typography>
                <ButtonGroup>
                    {status === "recording" ? <Button disabled={speechTime > 0} startIcon={<Stop />} variant="contained" onClick={event => {
                        (mediaRecorder.current as MediaRecorder).stop();
                        clearInterval(intervalID.current);
                        clearInterval(speechTimeIntervalID.current);
                        intervalID.current = 0;
                        speechTimeIntervalID.current = 0;
                        setStatus("inactive");
                    }}>
                        {get("speech.stop")}
                    </Button> : <Button startIcon={<PlayArrow />} variant="contained" onClick={event => {
                        setSelectTime(true);
                    }}>
                        {get("speech.start")}
                    </Button>
                    }
                    <Button variant="outlined" startIcon={<Download />} onClick={event => {
                        const okExt = [
                            ["audio/ogg", "ogg"],
                            ["audio/webm", "webm"],
                            ["audio/webm;codecs=opus", "webm"],
                            ["audio/mpeg", "mp3"]
                        ].find(a => MediaRecorder.isTypeSupported(a[0]));
                        saveAs(audioFile.current, `speech.${okExt[1]}`);
                    }}>
                        {get("speech.download")}
                    </Button>
                    <br />
                    <Button variant="outlined" onClick={event => {
                        setShowWarning(true);
                    }}>
                        {get("speech.vibrate.view")}
                    </Button>
                </ButtonGroup>
            </Box>
            <PureDialog title={get("speech.vibrate.view")} onClose={() => {
                setShowWarning(false);
            }} open={showWarning}>
                <List>
                    {warnings.map(singleWarning => <ListItem key={singleWarning[0]}>
                        <ListItemText
                            primary={`${get("speech.vibrate.time.occurrence")}: ${new Date(singleWarning[0]).toLocaleString()}`}
                            secondary={`${get("speech.vibrate.time.duration")}: ${singleWarning[1]}s`}
                        />
                    </ListItem>)}
                </List>
            </PureDialog>
            <InputDialog open={selectTime} onDone={context => {
                setSpeechTime(Number(context));
                setAllSpeechTime(Number(context));
                setStatus("recording");
                (mediaRecorder.current as MediaRecorder).start(secondDivMS);
                haveTime.current = Date.now();
                clearInterval(speechTimeIntervalID.current);
                speechTimeIntervalID.current = setInterval(timeIntervaler, secondDivMS) as unknown as number;
                clearInterval(intervalID.current);
                intervalID.current = setInterval(intervaler, secondDivMS) as unknown as number;
                return setSelectTime(false);
            }} inputAdd={{
                type: "number"
            }} context={get("speech.select.context")} title={get("speech.select.title")} label={get("speech.select.label")} />
        </Container>
    );
}
