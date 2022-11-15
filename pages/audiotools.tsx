import Head from "next/head";
import {
    Button
} from "@mui/material";
import { useEffect } from "react";
function AudioTools(): JSX.Element {
    useEffect(function () {
        var start = document.querySelector('#start');
        var stop = document.querySelector('#stop');
        var container = document.querySelector('#audio-container');
        var recorder = new Recorder({
            sampleRate: 44100, //采样频率，默认为44100Hz(标准MP3采样率)
            bitRate: 128, //比特率，默认为128kbps(标准MP3质量)
            success: function () { //成功回调函数
                start.disabled = false;
            },
            error: function (msg) { //失败回调函数
                alert(msg);
            },
            fix: function (msg) { //不支持H5录音回调函数
                alert(msg);
            }
        });
        start.addEventListener('click', function () {
            this.disabled = true;
            stop.disabled = false;
            var audio = document.querySelectorAll('audio');
            for (var i = 0; i < audio.length; i++) {
                if (!audio[i].paused) {
                    audio[i].pause();
                }
            }
            recorder.start();
        });
        stop.addEventListener('click', function () {
            this.disabled = true;
            start.disabled = false;
            recorder.stop();
            recorder.getBlob(function (blob) {
                var audio = document.createElement('audio');
                audio.src = URL.createObjectURL(blob);
                audio.controls = true;
                audio.loop = true;
                container.appendChild(audio);
            });
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
        var speed = prompt("请输入语速（0～15）：", "0");
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
        <>
            <Head>
                <title>AudioTools</title>
                <style>{`
			            audio { display: block; margin-bottom: 10px; }
            		    #audio-container { padding: 20px 0; }
            		    .ui-btn { display: inline-block; padding: 5px 20px; font-size: 14px; line-height: 1.428571429; box-sizing:content-box; text-align: center; border: 1px solid #e8e8e8; border-radius: 3px; color: #555; background-color: #fff; border-color: #e8e8e8; white-space: nowrap; cursor: pointer; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; }
            		    .ui-btn:hover, .ui-btn.hover { color: #333; text-decoration: none; background-color: #f8f8f8; border:1px solid #ddd; }
            		    .ui-btn:focus, .ui-btn:active { color: #333; outline: 0; }
            		    .ui-btn.disabled, .ui-btn.disabled:hover, .ui-btn.disabled:active, .ui-btn[disabled], .ui-btn[disabled]:hover, .ui-state-disabled .ui-btn { cursor: not-allowed; background-color: #eee; border-color: #eee; color: #aaa; }
            		    .ui-btn-primary { color: #fff;  background-color: #39b54a;  border-color: #39b54a; }
            		    .ui-btn-primary:hover, .ui-btn-primary.hover { color: #fff; background-color: #16a329; border-color: #16a329; }
            		    .ui-btn-primary:focus, .ui-btn-primary:active { color: #fff; }
            		    .ui-btn-primary.disabled:focus{ color: #aaa; }
                    `}</style>
            </Head>
            <script src='https://wangpengfei15974.github.io/recorder.js/js/recorder.js'></script>
            <div id='audioreplay' style={{
                border: "2px solid black"
            }}>
                <h2>音频循环播放</h2>
                <div id="audioplay-loop"></div>
                <input type='file'
                    onChange={onChange}
                    id='inputfile' />
            </div>
            <br />
            <div id='audioinput' style={{
                border: '2px solid black'
            }}>
                <h2>音频录制并循环</h2>
                <button id="start" className="ui-btn ui-btn-primary">录音</button>
                <button id="stop" className="ui-btn ui-btn-primary" disabled={true}>停止</button>
                <div id="audio-container"></div>
            </div>
            <br />
            <div id="text-to-audio" style={{
                border: '2px solid black'
            }}>
                <h2>文字转音频</h2>
                <button onClick={tts} style={{
                    display: 'inline-block'
                }}>点我</button>
                <div id='audioplay-tts'></div>
                <p style={{}}>Powered by Sogou TTS.</p>
            </div>
        </>
    );
};
export default AudioTools;