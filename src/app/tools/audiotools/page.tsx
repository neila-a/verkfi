"use client";
import I18N from 'react-intl-universal';
import {
    Button,
    Paper,
    Typography
} from "@mui/material";
import {
    useEffect, 
    useState
} from "react";
import {
    FilePond,
    registerPlugin
} from 'react-filepond'; // Import React FilePond
import FilePondPluginFileRename from 'filepond-plugin-file-rename'; // Import the plugin code
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'; // Import the plugin code
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'; // Import the plugin styles
import FilePondPluginImageResize from 'filepond-plugin-image-resize'; // Import the plugin code
import FilePondPluginImageEdit from 'filepond-plugin-image-edit'; // Import the plugin code
import 'filepond-plugin-image-edit/dist/filepond-plugin-image-edit.css'; // Import the plugin styles
import FilePondPluginImageCrop from 'filepond-plugin-image-crop'; // Import the plugin code
import {
    FilePondFile
} from "filepond";
import 'filepond/dist/filepond.min.css'; // Import FilePond styles
import style from "./AudioTools.module.scss";
import LpLogger from "lp-logger";
var logger = new LpLogger({
    name: "AudioTools",
    level: "log", // 空字符串时，不显示任何信息
});
export type status = "recording" | "paused" | "inactive";
function AudioTools(): JSX.Element {
    var [loopAudioSrc, setLoopAudioSrc] = useState<string>(""),
        [loopSpeakAudioSrc, setLoopSpeakAudioSrc] = useState<string>(""),
        [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | "awaqwq">("awaqwq"),
        [status, setStatus] = useState<status>("inactive");
    registerPlugin(FilePondPluginFileRename, FilePondPluginImagePreview, FilePondPluginImageResize, FilePondPluginImageEdit, FilePondPluginImageCrop); // Register the plugin
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
        <>
            <Paper elevation={24} id="audioreplay" className={style["audioreplay"]}>
                <div>
                    <Typography variant="h3" gutterBottom>{I18N.get('音频循环播放')}</Typography>
                    <audio controls loop src={loopAudioSrc}>
                        {I18N.get('您的浏览器不支持 audio 元素。')}
                    </audio>
                    <FilePond
                        files={[]}
                        onupdatefiles={(audios: FilePondFile[]) => {
                            setLoopAudioSrc(window.URL.createObjectURL(audios[0].file));
                        }}
                        allowMultiple={true}
                        maxFiles={1}
                        name="files"
                        labelIdle={I18N.get('拖拽音频到这里')}
                    />
                </div>
                <br />
            </Paper>
            <Paper elevation={24} id="audioinput" className={style["audioinput"]}>
                <div>
                    <Typography variant="h3" gutterBottom>{I18N.get('音频录制并循环')}</Typography>
                    <Button variant="contained" onClick={() => {
                        return controlAudio("recording");
                    }} disabled={status == "recording"}>{I18N.get('开始')}</Button>
                    <Button variant="contained" onClick={() => {
                        return controlAudio("inactive");
                    }} disabled={status == "inactive"}>{I18N.get('停止')}</Button>
                    <audio controls loop src={loopSpeakAudioSrc}>
                        {I18N.get('您的浏览器不支持 audio 元素。')}
                    </audio>
                </div>
                <br />
            </Paper>
        </>
    );
};
export default AudioTools;