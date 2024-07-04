"use client";
import {
    PlayArrow,
    Stop
} from "@mui/icons-material";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    Typography
} from "@mui/material";
import isBrowser from "@verkfi/shared/isBrowser";
import {
    useReducer,
    useRef
} from "react";
import {
    FilePond
} from "react-filepond"; // Import React FilePond
import {
    get
} from "react-intl-universal";
import getRecording from "@verkfi/shared/getRecording";
import useBlobState from "@verkfi/shared/useBlobState";
export type status = "recording" | "paused" | "inactive";
function AudioTools() {
    const mediaRecorder = useRef<"awaqwq" | MediaRecorder>("awaqwq"),
        [loopAudioSrc, setLoopAudioSrc] = useBlobState(),
        [loopSpeakAudioSrc, setLoopSpeakAudioSrc] = useBlobState(),
        [status, setStatus] = useReducer((old: status, set: status) => {
            switch (set) {
                case "inactive":
                    (mediaRecorder.current as MediaRecorder).stop();
                    break;
                case "paused":
                    (mediaRecorder.current as MediaRecorder).pause();
                    break;
                case "recording":
                    (mediaRecorder.current as MediaRecorder).start();
                    break;
            }
            return set;
        }, "inactive");
    if (mediaRecorder.current === "awaqwq") {
        if (isBrowser()) {
            getRecording(blob => setLoopSpeakAudioSrc(blob)).then(recording => {
                mediaRecorder.current = recording;
            });
        } // ref不怕重复刷新，可以不用useEffect
    }
    return <>
        <Accordion defaultExpanded>
            <AccordionSummary>
                <Typography variant="h4">
                    {get("音频循环播放")}
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <audio controls loop src={loopAudioSrc} />
                <FilePond
                    files={[]}
                    onupdatefiles={audios => audios.forEach(audio => setLoopAudioSrc(audio.file))}
                    allowMultiple
                    maxFiles={1}
                    name="files"
                    acceptedFileTypes={["audio/*"]}
                    labelIdle={get("drag.拖拽音频到这里")}
                />
            </AccordionDetails>
        </Accordion>
        <Accordion defaultExpanded>
            <AccordionSummary>
                <Typography variant="h4">
                    {get("音频录制并循环")}
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <FilePond
                    files={[]}
                    onupdatefiles={audios => audios.forEach(audio => setLoopAudioSrc(audio.file))}
                    allowMultiple
                    maxFiles={1}
                    name="files"
                    acceptedFileTypes={["audio/*"]}
                    labelIdle={get("drag.拖拽音频到这里")}
                />
                <Button startIcon={<PlayArrow />} variant="contained" onClick={() => {
                    return setStatus("recording");
                }} disabled={status === "recording"}>
                    {get("开始")}
                </Button>
                <audio controls loop src={loopSpeakAudioSrc} />
                <Button startIcon={<Stop />} variant="contained" onClick={() => {
                    return setStatus("inactive");
                }} disabled={status === "inactive"}>
                    {get("停止")}
                </Button>
            </AccordionDetails>
        </Accordion>
    </>;
}
export default AudioTools;
