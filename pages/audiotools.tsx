import Head from "next/head";
import Script from "next/script";
import {
    Button,
    Paper,
    Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import Recorder from "../lib/recorder";
function AudioTools(): JSX.Element {
    var [startDisabled, setStartDisabled] = useState(false);
    var [stopDisabled, setStopDisabled] = useState(true);
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
            setStopDisabled(false);
            setStartDisabled(true);
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
    function tts() {
        var text = prompt('请输入需要转换的文字：', '你好像没输入任何文字。');
        var speed: any = prompt("请输入语速（0～15）：", "0");
        if (speed < 1) {
            alert("你输入的语速比1还小,太小了！");
            return;
        } else if (speed > 15) {
            alert("你输入的语速比15还大，太大了！");
            return;
        }
        var lang = prompt('请输入语言（"zh"表示中文，"en"表示英文）：', "zh");
        var lang = lang.replace('zh', 'zh-CHS');
        var url = `https://fanyi.sogou.com/reventondc/synthesis?text=${text}&speed=${speed}&lang=${lang}&from=translateweb&speaker=6`;
        document.getElementById("audioplay-tts").innerHTML = `<iframe src='${url}'</iframe>`;
    }
    return (
        <div>
            <Head>
                <title>AudioTools</title>
                <style>{`
                    #audioreplay > div, #audioinput > div, #text2audio > div {
                        margin: 10px
                    }
                `}</style>
            </Head>
            <Paper elevation={24} id="audioreplay">
                <div>
                    <Typography variant="h3" gutterBottom>音频循环播放</Typography>
                    <div id="audioplay-loop"></div>
                    <input type='file' onChange={onChange} id='inputfile' />
                </div>
            </Paper>
            <br />
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
                    <Button color="primary" variant="contained" onClick={tts} style={{
                        display: 'inline-block'
                    }}>点我</Button>
                    <div id='audioplay-tts'></div>
                    <p style={{}}>Powered by Sogou TTS.</p>
                </div>
            </Paper>
        </div>
    );
};
export default AudioTools;