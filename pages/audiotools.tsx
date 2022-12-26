import Head from "next/head";
import {
    Button,
    Paper,
    Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import HeadBar from "../components/HeadBar";
import Recorder from "../lib/recorder";
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
export default function AudioTools(): JSX.Element {
    var [startDisabled, setStartDisabled] = useState<boolean>(false);
    var [stopDisabled, setStopDisabled] = useState<boolean>(true);
    var [TTSURL, setTTSURL] = useState<string>("");
    registerPlugin(FilePondPluginFileRename, FilePondPluginImagePreview, FilePondPluginImageResize, FilePondPluginImageEdit, FilePondPluginImageCrop); // Register the plugin
    useEffect(function () {
        var start = document.querySelector('#start');
        var stop = document.querySelector('#stop');
        var container = document.querySelector('#audio-container');
        var recorder = Recorder({
            sampleRate: 44100, //采样频率，默认为44100Hz(标准MP3采样率)
            bitRate: 128, //比特率，默认为128kbps(标准MP3质量)
            success: function () { //成功回调函数
                setStartDisabled(false);
            },
            error: function (msg) { //失败回调函数
                alert(msg);
            },
            fix: function (msg) { //不支持H5录音回调函数
                alert(msg);
            }
        });
        start.addEventListener('click', function () {
            setStartDisabled(true);
            setStopDisabled(false);
            container.innerHTML = "";
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
            recorder.getBlob(function (blob) {
                var audio = document.createElement('audio');
                audio.src = URL.createObjectURL(blob);
                console.log(`成功加载音频：${audio.src}`);
                audio.controls = true;
                audio.loop = true;
                container.appendChild(audio);
            });
            var AudioElements = document.querySelectorAll("audio");
            for (let i = 0; i < AudioElements.length; i++) {
            };
        });
    });
    function TTS(): void {
        var text: string = prompt('请输入需要转换的文字：', '你好像没输入任何文字。');
        var speed: any = prompt("请输入语速（0～15）：", "0");
        if (speed < 1) {
            alert("你输入的语速比1还小,太小了！");
            return;
        } else if (speed > 15) {
            alert("你输入的语速比15还大，太大了！");
            return;
        }
        setTTSURL(`https://fanyi.sogou.com/reventondc/synthesis?text=${text}&speed=${speed}&lang=${prompt('请输入语言（"zh"表示中文，"en"表示英文）：', "zh").replace('zh', 'zh-CHS')}&from=translateweb&speaker=6`);
    }
    function procFromClipboard(): void {
        navigator.clipboard.readText().then((value) => {
            setTTSURL(`https://fanyi.sogou.com/reventondc/synthesis?text=${value}&speed=1&lang=zh&from=translateweb&speaker=6`);
            console.log("获取剪贴板成功：", value);
        }).catch((value) => {
            console.log("获取剪贴板失败: ", value);
        });
    };
    var [loopAudioType, setLoopAudioType] = useState<string>("");
    var [loopAudioSrc, setLoopAudioSrc] = useState<string>("");
    return (
        <>
            <style>{`
                #audioreplay > div, #audioinput > div, #text2audio > div {
                    margin: 10px
                }
            `}</style>
            <HeadBar isIndex={false} pageName="AudioTools" />
            <Paper elevation={24} id="audioreplay">
                <div>
                    <Typography variant="h3" gutterBottom>音频循环播放</Typography>
                    <audio controls loop>
                        <source src={loopAudioSrc} type={loopAudioType} />
                        您的浏览器不支持 audio 元素。
                    </audio>
                    <FilePond
                        files={[]}
                        onupdatefiles={(audios: FilePondFile[]) => {
                            setLoopAudioType(audios[0].fileType);
                            setLoopAudioSrc(window.URL.createObjectURL(audios[0].file));
                        }}
                        allowMultiple={true}
                        maxFiles={1}
                        name="files"
                        labelIdle='拖拽音频到这里、粘贴或<span class="filepond--label-action">浏览</span>'
                    />
                </div>
            </Paper>
            <Paper elevation={24} id="audioinput">
                <div>
                    <Typography variant="h3" gutterBottom>音频录制并循环</Typography>
                    <Button id="start" variant="contained" disabled={startDisabled}>录音</Button>
                    <Button id="stop" variant="contained" disabled={stopDisabled}>停止</Button>
                    <div id="audio-container"></div>
                </div>
            </Paper>
            <Paper elevation={24} id='text2audio'>
                <div>
                    <Typography variant="h3" gutterBottom>文字转音频</Typography>
                    <Button color="primary" variant="contained" onClick={TTS}>点我</Button>
                    <Button color="primary" variant="outlined" onClick={procFromClipboard}>从剪贴板读取</Button>
                    <br />
                    <iframe src={TTSURL} title="TTS content"></iframe>
                    <Typography variant="body1" gutterBottom>Powered by Sogou TTS</Typography>
                </div>
            </Paper>
        </>
    );
};