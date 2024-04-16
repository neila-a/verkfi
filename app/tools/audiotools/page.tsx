"use client";
import {
    get
} from 'react-intl-universal';
import {
    Button,
    Grid,
    Typography
} from "@mui/material";
import {
    useEffect,
    useRef,
    useState
} from "react";
import {
    FilePond
} from 'react-filepond'; // Import React FilePond
import {
    FilePondFile
} from "filepond";
import Module from './Module';
import {
    PlayArrow,
    Stop
} from '@mui/icons-material';
import getRecording from './getRecording';
import {
    isBrowser
} from 'layout/layoutClient';
export type status = "recording" | "paused" | "inactive";
function AudioTools(): JSX.Element {
    const [loopAudioSrc, setLoopAudioSrc] = useState<string>(""),
        [loopSpeakAudioSrc, setLoopSpeakAudioSrc] = useState<string>(""),
        [status, setStatus] = useState<status>("inactive"),
        mediaRecorder = useRef<"awaqwq" | MediaRecorder>("awaqwq");
    if (isBrowser()) {
        getRecording(blob => setLoopSpeakAudioSrc(URL.createObjectURL(blob))).then(recording => {
            mediaRecorder.current = recording;
        });
    } // ref不怕重复刷新，可以不用useEffect
    function controlAudio(stat: status) {
        setStatus(stat);
        switch (stat) {
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
    }
    return (
        <Grid container direction="column" spacing={2}>
            <Grid item>
                <Module>
                    <Typography variant="h4" gutterBottom>{get('音频循环播放')}</Typography>
                    <audio controls loop src={loopAudioSrc}>
                        {get('你的浏览器不支持 audio 元素。')}
                    </audio>
                    <FilePond
                        files={[]}
                        onupdatefiles={(audios: FilePondFile[]) => audios.forEach(audio => setLoopAudioSrc(window.URL.createObjectURL(audio.file)))}
                        allowMultiple={true}
                        maxFiles={1}
                        name="files"
                        acceptedFileTypes={["audio/*"]}
                        labelIdle={get('drag.拖拽音频到这里')}
                    />
                </Module>
            </Grid>
            <Grid item>
                <Module>
                    <Typography variant="h4" gutterBottom>{get('音频录制并循环')}</Typography>
                    <Button startIcon={<PlayArrow />} variant="contained" onClick={() => {
                        return controlAudio("recording");
                    }} disabled={status == "recording"}>{get('开始')}</Button>
                    <Button startIcon={<Stop />} variant="contained" onClick={() => {
                        return controlAudio("inactive");
                    }} disabled={status == "inactive"}>{get('停止')}</Button>
                    <audio controls loop src={loopSpeakAudioSrc}>
                        {get('你的浏览器不支持 audio 元素。')}
                    </audio>
                </Module>
            </Grid>
        </Grid>
    );
};
export default AudioTools;