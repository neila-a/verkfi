import {
    Button,
    Paper,
    Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import HeadBar from "../components/HeadBar";
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
import style from "../../styles/AudioTools.module.scss";
import LpLogger from "lp-logger";
export var logger = new LpLogger({
    name: "AudioTools",
    level: "log", // 空字符串时，不显示任何信息
    
});
export default function AudioTools(): JSX.Element {
    var [startDisabled, setStartDisabled] = useState<boolean>(false);
    var [stopDisabled, setStopDisabled] = useState<boolean>(true);
    var [loopAudioSrc, setLoopAudioSrc] = useState<string>("");
    var [loopSpeakAudioSrc, setLoopSpeakAudioSrc] = useState<string>("");
    registerPlugin(FilePondPluginFileRename, FilePondPluginImagePreview, FilePondPluginImageResize, FilePondPluginImageEdit, FilePondPluginImageCrop); // Register the plugin
    useEffect(function () {
        var start = document.querySelector('#start');
        var stop = document.querySelector('#stop');
        if (navigator.mediaDevices.getUserMedia) {
            var constraints = { audio: true };
            navigator.mediaDevices.getUserMedia(constraints).then(
                stream => {
                    var audio: Blob;
                    logger.log("授权成功。");
                    const mediaRecorder = new MediaRecorder(stream);
                    mediaRecorder.ondataavailable = event => audio = event.data;
                    mediaRecorder.onstop = event => setLoopSpeakAudioSrc(URL.createObjectURL(audio));
                    start.addEventListener('click', function () {
                        setStartDisabled(true);
                        logger.log("已关闭开始按钮。");
                        var audio = document.querySelectorAll('audio');
                        for (var i = 0; i < audio.length; i++) {
                            if (!audio[i].paused) {
                                audio[i].pause();
                            }
                        }
                        mediaRecorder.start();
                        logger.log("已开始录音。");
                        setStopDisabled(false);
                        logger.log("已开启停止按钮。");
                    });
                    stop.addEventListener('click', function () {
                        setStopDisabled(true);
                        logger.log("已关闭停止按钮。");
                        mediaRecorder.stop();
                        logger.log("已停止录音。");
                        setStartDisabled(false);
                        logger.log("已开启开始按钮。");
                    });
                },
                () => {
                    logger.error("授权失败。");
                }
            );
        } else {
            logger.error("浏览器不支持 getUserMedia。");
        }
    });
    return (
        <>
            <Paper elevation={24} id="audioreplay" className={style["audioreplay"]}>
                <div>
                    <Typography variant="h3" gutterBottom>音频循环播放</Typography>
                    <audio controls loop src={loopAudioSrc}>
                        您的浏览器不支持 audio 元素。
                    </audio>
                    <FilePond
                        files={[]}
                        onupdatefiles={(audios: FilePondFile[]) => {
                            setLoopAudioSrc(window.URL.createObjectURL(audios[0].file));
                        }}
                        allowMultiple={true}
                        maxFiles={1}
                        name="files"
                        labelIdle='拖拽音频到这里、粘贴或<span class="filepond--label-action">浏览</span>'
                    />
                </div>
            </Paper>
            <Paper elevation={24} id="audioinput" className={style["audioinput"]}>
                <div>
                    <Typography variant="h3" gutterBottom>音频录制并循环</Typography>
                    <Button id="start" variant="contained" disabled={startDisabled}>录音</Button>
                    <Button id="stop" variant="contained" disabled={stopDisabled}>停止</Button>
                    <audio controls loop src={loopSpeakAudioSrc}>
                        您的浏览器不支持 audio 元素。
                    </audio>
                </div>
            </Paper>
        </>
    );
};