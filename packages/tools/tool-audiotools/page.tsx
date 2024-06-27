"use client";
import {
    PlayArrow,
    Stop
} from "@mui/icons-material";
import {
    Button,
    Grid,
    Typography
} from "@mui/material";
import {
    FilePondFile
} from "filepond";
import isBrowser from "@verkfi/shared/isBrowser";
import {
    useReducer,
    useRef,
    useState
} from "react";
import {
    FilePond
} from "react-filepond"; // Import React FilePond
import {
    get
} from "react-intl-universal";
import Module from "./Module";
import getRecording from "@verkfi/shared/getRecording";
import useBlobState from "@verkfi/shared/useBlobState";
export type status = "recording" | "paused" | "inactive";
function AudioTools(): JSX.Element {
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
    return (
        <Grid container direction="column" spacing={2}>
            <Grid item>
                <Module>
                    <Typography variant="h4" gutterBottom>
                        {get("音频循环播放")}
                    </Typography>
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
                </Module>
            </Grid>
            <Grid item>
                <Module>
                    <Typography variant="h4" gutterBottom>
                        {get("音频录制并循环")}
                    </Typography>
                    <Button startIcon={<PlayArrow />} variant="contained" onClick={() => {
                        return setStatus("recording");
                    }} disabled={status === "recording"}>
                        {get("开始")}
                    </Button>
                    <Button startIcon={<Stop />} variant="contained" onClick={() => {
                        return setStatus("inactive");
                    }} disabled={status === "inactive"}>
                        {get("停止")}
                    </Button>
                    <audio controls loop src={loopSpeakAudioSrc} />
                </Module>
            </Grid>
        </Grid>
    );
}
export default AudioTools;
