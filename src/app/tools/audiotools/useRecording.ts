"use client";
import {
    useEffect,
    useRef
} from "react";
import {
    logger
} from './page';
import {
    isBrowser
} from "../../layout/layoutClient";
export default function useRecording(onStop: (blob: Blob) => any, onDataAvailable?: (blob: Blob) => any) {
    const mediaRecorder = useRef<MediaRecorder | "awaqwq">("awaqwq");
    useEffect(function () {
        (async () => {
            if (navigator.mediaDevices.getUserMedia && mediaRecorder.current == "awaqwq") {
                const constraints = {
                    audio: true
                };
                try {
                    const stream = await navigator.mediaDevices.getUserMedia(constraints);
                    if (mediaRecorder.current != "awaqwq") {
                        stream.getTracks()[0].stop();
                        logger.log("录音已停止");
                    }
                    var audio: Blob;
                    logger.log("授权成功。");
                    const _mediaRecorder = new MediaRecorder(stream);
                    _mediaRecorder.ondataavailable = event => {
                        audio = event.data;
                        if (onDataAvailable !== undefined) {
                            onDataAvailable(event.data);
                        }
                    };
                    _mediaRecorder.onstop = event => {
                        logger.log("录音已停止");
                        onStop(audio);
                    };
                    _mediaRecorder.onpause = event => {
                        logger.log("录音已暂停");
                    };
                    _mediaRecorder.onstart = event => {
                        logger.log("录音已开始");
                    };
                    _mediaRecorder.onresume = event => {
                        logger.log("录音已继续");
                    };
                    mediaRecorder.current = _mediaRecorder;
                } catch (error) {
                    logger.error(`授权失败：`, error);
                }
            } else {
                logger.error("浏览器不支持 getUserMedia。");
            }
        })();
        return () => {
            logger.log("AudioTools已经被卸载，正在返还录音权限。");
            if (mediaRecorder.current != "awaqwq") {
                mediaRecorder.current.stream.getTracks().forEach(track => {
                    track.stop();
                });
            }
        };
    }, []);
    return mediaRecorder;
}
