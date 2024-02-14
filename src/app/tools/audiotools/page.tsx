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
var logger = new LpLogger({
    name: "AudioTools",
    level: "log", // 空字符串时，不显示任何信息
});
export type status = "recording" | "paused" | "inactive";
function AudioTools(): JSX.Element {
    const [loopAudioSrc, setLoopAudioSrc] = useState<string>(""),
        [loopSpeakAudioSrc, setLoopSpeakAudioSrc] = useState<string>(""),
        [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | "awaqwq">("awaqwq"),
        [status, setStatus] = useState<status>("inactive");
    useEffect(function () {
        if (navigator.mediaDevices.getUserMedia && mediaRecorder == "awaqwq") {
            var constraints = { audio: true };
            navigator.mediaDevices.getUserMedia(constraints).then(
                stream => {
                    if (mediaRecorder != "awaqwq") {
                        stream.getTracks()[0].stop();
                        logger.log("录音已停止");
                    }
                    var audio: Blob;
                    logger.log("授权成功。");
                    const _mediaRecorder = new MediaRecorder(stream);
                    _mediaRecorder.ondataavailable = event => audio = event.data;
                    _mediaRecorder.onstop = event => {
                        logger.log("录音已停止");
                        setLoopSpeakAudioSrc(URL.createObjectURL(audio));
                    };
                    _mediaRecorder.onpause = event => {
                        logger.log("录音已暂停");
                    };
                    _mediaRecorder.onstart = event => {
                        logger.log("录音已开始");
                    }
                    _mediaRecorder.onresume = event => {
                        logger.log("录音已继续");
                    }
                    setMediaRecorder(_mediaRecorder);
                },
                () => {
                    logger.error("授权失败。");
                }
            );
        } else {
            logger.error("浏览器不支持 getUserMedia。");
        }
        return () => {
            logger.log("AudioTools已经被卸载，正在返还录音权限。");
            if (mediaRecorder != "awaqwq") {
                mediaRecorder.stream.getTracks().forEach(track => {
                    track.stop();
                })
            }
        };
    }, []);
    function controlAudio(stat: status) {
        setStatus(stat);
        switch (stat) {
            case "inactive":
                (mediaRecorder as MediaRecorder).stop();
                break;
            case "paused":
                (mediaRecorder as MediaRecorder).pause();
                break;
            case "recording":
                (mediaRecorder as MediaRecorder).start();
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
                    <Button variant="contained" onClick={() => {
                        return controlAudio("recording");
                    }} disabled={status == "recording"}>{get('开始')}</Button>
                    <Button variant="contained" onClick={() => {
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