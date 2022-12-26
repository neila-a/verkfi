import Head from "next/head";
import {
    Button,
    Paper,
    Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import HeadBar from "../components/HeadBar";
import Recorder from "../lib/recorder";
function AudioTools(): JSX.Element {
    var [startDisabled, setStartDisabled] = useState<boolean>(false);
    var [stopDisabled, setStopDisabled] = useState<boolean>(true);
    var [TTSURL, setTTSURL] = useState<string>("");
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
    function onChange(event) {
        const file = event.target.files[0];
        var outputtext = `[FileReader] 已读取'${file.name}'，最后修改时间是${file.lastModifiedDate}，类别是${file.type}，大小是${file.size}字节。`;
        console.log(outputtext);
        const reader = new FileReader();
        reader.onloadend = (arg) => {
            document.getElementById("audioplay-loop").innerHTML = `<audio controls loop style=''><source src='${reader.result}' type='${file.type}'/>您的浏览器不支持 audio 元素。</audio>`;
        };
        return reader.readAsDataURL(file);
    }
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
    return (
        <div>
            <Head>
                <style>{`
                    #audioreplay > div, #audioinput > div, #text2audio > div {
                        margin: 10px
                    }
                `}</style>
            </Head>
            <HeadBar isIndex={false} pageName="AudioTools" />
            <Paper elevation={24} id="audioreplay">
                <div>
                    <Typography variant="h3" gutterBottom>音频循环播放</Typography>
                    <div id="audioplay-loop"></div>
                    <input type='file' onChange={onChange} id='inputfile' />
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
        </div>
    );
};
export default AudioTools;