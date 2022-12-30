import {
    Button,
    Paper,
    Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import HeadBar from "../../components/HeadBar";
import Recorder from "../../lib/recorder";
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
export default function AudioTools(): JSX.Element {
    var [startDisabled, setStartDisabled] = useState<boolean>(false);
    var [stopDisabled, setStopDisabled] = useState<boolean>(true);
    var [loopAudioSrc, setLoopAudioSrc] = useState<string>("");
    var [haveLoopAudio, setHaveLoopAudio] = useState<boolean>(false);
    var [loopSpeakAudioSrc, setLoopSpeakAudioSrc] = useState<string>("");
    var [haveSpeakLoopAudio, setHaveSpeakLoopAudio] = useState<boolean>(false);
    registerPlugin(FilePondPluginFileRename, FilePondPluginImagePreview, FilePondPluginImageResize, FilePondPluginImageEdit, FilePondPluginImageCrop); // Register the plugin
    useEffect(function () {
        var start = document.querySelector('#start');
        var stop = document.querySelector('#stop');
        var recorder = Recorder({
            sampleRate: 44100, //采样频率，默认为44100Hz(标准MP3采样率)
            bitRate: 128, //比特率，默认为128kbps(标准MP3质量)
            success: function () { //成功回调函数
                setStartDisabled(false);
            },
            error: function (msg: string) { //失败回调函数
                alert(msg);
            },
            fix: function (msg: string) { //不支持H5录音回调函数
                alert(msg);
            }
        });
        start.addEventListener('click', function () {
            setStartDisabled(true);
            setStopDisabled(false);
            var audio = document.querySelectorAll('audio');
            for (var i = 0; i < audio.length; i++) {
                if (!audio[i].paused) {
                    audio[i].pause();
                }
            }
            recorder.start();
        });
        stop.addEventListener('click', function () {
            setStopDisabled(true);
            setStartDisabled(false);
            recorder.stop();
            recorder.getBlob(function (blob: Blob) {
                setHaveSpeakLoopAudio(true);
                setLoopSpeakAudioSrc(URL.createObjectURL(blob));
            });
        });
    });
    return (
        <>
            <HeadBar isIndex={false} pageName="AudioTools" />
            <Paper elevation={24} id="audioreplay" className={style["audioreplay"]}>
                <div>
                    <Typography variant="h3" gutterBottom>音频循环播放</Typography>
                    { haveLoopAudio ? <audio controls loop src={loopAudioSrc}>
                        您的浏览器不支持 audio 元素。
                    </audio> : <></> }
                    <FilePond
                        files={[]}
                        onupdatefiles={(audios: FilePondFile[]) => {
                            setHaveLoopAudio(true);
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
                    { haveSpeakLoopAudio ? <audio controls loop src={loopSpeakAudioSrc}>
                        您的浏览器不支持 audio 元素。
                    </audio> : <></> }
                </div>
            </Paper>
        </>
    );
};