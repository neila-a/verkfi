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
    useState
} from "react";
import {
    FilePond
} from 'react-filepond'; // Import React FilePond
import {
    FilePondFile
} from "filepond";
import LpLogger from "lp-logger";
import Module from './Module';
import {
    PlayArrow,
    Stop
} from '@mui/icons-material';
import useRecording from './useRecording';
export var logger = new LpLogger({
    name: "AudioTools",
    level: "log", // 空字符串时，不显示任何信息
});
export type status = "recording" | "paused" | "inactive";
function AudioTools(): JSX.Element {
    const [loopAudioSrc, setLoopAudioSrc] = useState<string>(""),
        [loopSpeakAudioSrc, setLoopSpeakAudioSrc] = useState<string>(""),
        mediaRecorder = useRecording(blob => setLoopSpeakAudioSrc(URL.createObjectURL(blob))),
        [status, setStatus] = useState<status>("inactive");
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
                        {get('您的浏览器不支持 audio 元素。')}
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
                        {get('您的浏览器不支持 audio 元素。')}
                    </audio>
                </Module>
            </Grid>
        </Grid>
    );
};
export default AudioTools;