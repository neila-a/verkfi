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
    Typography,
    useTheme
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
import getShortTimeEnergy from "./getShortTimeEnergy";
import {
    LiveAudioVisualizer
} from "react-audio-visualize";
import {
    emptySymbol
} from "@verkfi/shared/reader/atomWithStorage";
const

    // 只是导入
    PureDialog = dynamic(() => import("@verkfi/shared/dialog/Pure")),

    // 一定是这样的常数
    SpeechingWatershedWave = 15, // if it didn't speech in 15 seconds, it throws a warning
    defaultSpeechTime = 600,
    secondDivMS = 1000,
    vibrateTimes = 4,
    vibrateTime = 250,
    emptyBlobContext = ["Why you downloaded this??? Do not do it!!!"],

    // 试验得到的常数
    NoiseVoiceWatershedWave = 20; // origin 2.3
export default function Speech() {
    const [status, setStatus] = useState<RecordingState>("inactive"),
        [mediaRecorder, setMediaRecorder] = useState<typeof emptySymbol | MediaRecorder>(emptySymbol),
        intervalID = useRef(0),
        speechTimeIntervalID = useRef(0),
        haveTime = useRef(Date.now()),
        [countdown, setCountdown] = useState(0),
        [showWarning, setShowWarning] = useState(false),
        [selectTime, setSelectTime] = useState(false),
        [speechTime, setSpeechTime] = useState(defaultSpeechTime),
        [allSpeechTime, setAllSpeechTime] = useState(defaultSpeechTime),
        [warnings, setWarnings] = useState<Record<number, number>>({
        }), // 发生时间作为key是一定唯一的
        /**
         * 只有第一个块里才有文件头
         */
        firstChunk = useRef(new Blob(emptyBlobContext)),
        theme = useTheme(),
        barColor = theme.palette.primary.main,
        audioFile = useRef(new Blob(emptyBlobContext));
    if (isBrowser()) {
        getRecording(blob => {
            audioFile.current = new Blob([blob]);
        }, async chunk => {
            // 加载文件头
            let blob: Blob;
            if (await firstChunk.current.text() === emptyBlobContext[0]) {
                firstChunk.current = chunk;
                blob = chunk;
            } else {
                blob = new Blob([firstChunk.current, chunk]);
            }

            // 解码数据
            const context = new AudioContext(),
                decodedBuffer = await context.decodeAudioData(await blob.arrayBuffer()),
                channelData = decodedBuffer.getChannelData(0),

                // 计算数据
                energy = getShortTimeEnergy(channelData),
                sum = energy.reduce((a, b) => a + b),
                avg = sum / energy.length,
                max = energy.toSorted()[energy.length - 1],
                watershed = max / avg,
                have = watershed < NoiseVoiceWatershedWave;

            // 更新状态
            if (have) {
                haveTime.current = Date.now();
            }
        }).then(recording => {
            setMediaRecorder(recording);
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
                setWarnings(old => ({
                    ...old,
                    [haveTime.current]: time
                }));
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
    return <Container sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "80vh"
    }}>
        <Typography variant="subtitle1">
            {get("speech.noSayTime")}
        </Typography>
        <Typography variant="h1" component="p" sx={{
            fontSize: "33vw",
            lineHeight: "33vw",
            color: theme => countdown > SpeechingWatershedWave ? theme.palette.error.main : theme.palette.primary.main
        }}>
            {countdown}
        </Typography>
        {mediaRecorder === emptySymbol ? false : <LiveAudioVisualizer
            mediaRecorder={mediaRecorder}
            width="200%"
            height={75}
            barColor={barColor}
        />}
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
                <Button disabled={status === "recording" ? speechTime > 0 || mediaRecorder === emptySymbol : false} onClick={event => {
                    if (status === "recording") {
                        (mediaRecorder as MediaRecorder).stop();
                        clearInterval(intervalID.current);
                        clearInterval(speechTimeIntervalID.current);
                        intervalID.current = 0;
                        speechTimeIntervalID.current = 0;
                        return setStatus("inactive");
                    }
                    intervalID.current = setInterval(intervaler, secondDivMS) as unknown as number;
                    speechTimeIntervalID.current = setInterval(timeIntervaler, secondDivMS) as unknown as number;
                    (mediaRecorder as MediaRecorder).start();
                    return setSelectTime(true);
                }} startIcon={status === "recording" ? <Stop /> : <PlayArrow />} variant="contained">
                    {get(`speech.${status === "recording" ? "stop" : "start"}`)}
                </Button>
                <Button variant="outlined" startIcon={<Download />} onClick={event => {
                    const okExt = [
                        ["audio/ogg", "ogg"],
                        ["audio/webm", "webm"],
                        ["audio/webm;codecs=opus", "webm"],
                        ["audio/mpeg", "mp3"]
                    ].find(a => MediaRecorder.isTypeSupported(a[0]));
                    saveAs(audioFile.current, `speech.${okExt?.[1]}`);
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
            (mediaRecorder as MediaRecorder).start(secondDivMS);
            haveTime.current = Date.now();
            clearInterval(speechTimeIntervalID.current);
            speechTimeIntervalID.current = setInterval(timeIntervaler, secondDivMS) as unknown as number;
            clearInterval(intervalID.current);
            intervalID.current = setInterval(intervaler, secondDivMS) as unknown as number;
            return setSelectTime(false);
        }} inputAdd={{
            type: "number"
        }} context={get("speech.select.context")} title={get("speech.select.title")} label={get("speech.select.label")} />
    </Container>;
}
