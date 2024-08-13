"use client";
import {
    Download,
    Pause,
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
import dynamic from "next/dynamic";
import {
    get
} from "react-intl-universal";
import {
    LiveAudioVisualizer
} from "react-audio-visualize";
import {
    emptySymbol
} from "@verkfi/shared/reader/atomWithStorage";
const PureDialog = dynamic(() => import("@verkfi/shared/dialog/Pure"));
import {
    SpeechingWatershedWave
} from "./consts";
import {
    useAtom,
    useAtomValue
} from "jotai";
import atoms from "./atoms";
export default function Speech() {
    const [status, setStatus] = useAtom(atoms.status),
        mediaRecorder = atoms.mediaRecorder.useMediaRecorder(),
        countdown = useAtomValue(atoms.countdown),
        [showWarning, setShowWarning] = useAtom(atoms.warnings.show),
        [selectTime, setSelectTime] = useAtom(atoms.selectTime.dialogOpen),
        [speechTime, setSpeechTime] = useAtom(atoms.selectTime.remaining),
        [allSpeechTime, setAllSpeechTime] = useAtom(atoms.selectTime.total),
        warnings = useAtomValue(atoms.warnings.record),
        audioFile = useAtomValue(atoms.audioFile),

        theme = useTheme(),
        barColor = theme.palette.primary.main;
    atoms.useCleanIDsonUnmount();
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
                <Button disabled={mediaRecorder === emptySymbol || !(status === "inactive" ? true : speechTime > 0)} onClick={() => {
                    if (status === "inactive") {
                        return setSelectTime(true);
                    }
                    return setStatus("inactive", mediaRecorder as MediaRecorder);
                }} startIcon={status === "inactive" ? <PlayArrow /> : <Stop />} variant="contained">
                    {get(`speech.${status === "inactive" ? "start" : "stop"}`)}
                </Button>
                <Button disabled={mediaRecorder === emptySymbol || status === "inactive"} onClick={() => {
                    if (status === "recording") {
                        setStatus("paused", mediaRecorder as MediaRecorder);
                    }
                    setStatus("resume", mediaRecorder as MediaRecorder);
                }} startIcon={status === "recording" ? <Pause /> : <PlayArrow />} variant="outlined">
                    {get(`speech.${status === "recording" ? "pause" : "contiune"}`)}
                </Button>
                <Button variant="outlined" startIcon={<Download />} onClick={() => {
                    const okExt = [
                        ["audio/ogg", "ogg"],
                        ["audio/webm", "webm"],
                        ["audio/webm;codecs=opus", "webm"],
                        ["audio/mpeg", "mp3"]
                    ].find(a => MediaRecorder.isTypeSupported(a[0]));
                    saveAs(audioFile as Blob, `speech.${okExt?.[1]}`);
                }} disabled={audioFile === emptySymbol}>
                    {get("speech.download")}
                </Button>
                <Button variant="outlined" onClick={() => {
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
                {Object.entries(warnings).map(singleWarning => <ListItem key={singleWarning[0]}>
                    <ListItemText
                        primary={`${get("speech.vibrate.time.occurrence")}: ${new Date(singleWarning[0]).toLocaleString()}`}
                        secondary={`${get("speech.vibrate.time.duration")}: ${singleWarning[1]}s`}
                    />
                </ListItem>)}
            </List>
        </PureDialog>
        <InputDialog open={selectTime} onDone={context => {
            setSpeechTime(+context);
            setAllSpeechTime(+context);
            setStatus("recording", mediaRecorder as MediaRecorder);
            return setSelectTime(false);
        }} inputAdd={{
            type: "number"
        }} context={get("speech.select.context")} title={get("speech.select.title")} label={get("speech.select.label")} />
    </Container>;
}
