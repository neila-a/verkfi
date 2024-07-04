import isBrowser from "./isBrowser";
import LpLogger from "lp-logger";
export default async function getRecording(onStop: (blob: Blob) => any, onDataAvailable?: (blob: Blob) => any, log = true) {
    let mediaRecorder = undefined as unknown as MediaRecorder;
    class Logger extends LpLogger {
        constructor() {
            super({
                name: "AudioTools",
                level: "log" // 空字符串时，不显示任何信息
            });
        }
        log(...a: any[]) {
            if (log) {
                super.log(...a);
            }
        }
    }
    const logger = new Logger();
    if (isBrowser() && navigator.mediaDevices.getUserMedia) {
        const chunks: Blob[] = [],
            constraints = {
                audio: true
            },
            mimeType = [
                "audio/ogg",
                "audio/webm",
                "audio/webm;codecs=opus",
                "audio/mpeg"
            ].find(a => MediaRecorder.isTypeSupported(a));
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        logger.log("授权成功。");
        mediaRecorder = new MediaRecorder(stream, {
            mimeType
        });
        mediaRecorder.ondataavailable = event => {
            chunks.push(event.data);
            if (typeof onDataAvailable === "function") {
                onDataAvailable(new Blob([chunks[0], event.data]));
            }
        };
        mediaRecorder.onstop = event => {
            logger.log("录音已停止");
            onStop(new Blob(chunks, {
                type: mimeType
            }));
            chunks.splice(0, chunks.length);
        };
        mediaRecorder.onpause = event => {
            logger.log("录音已暂停");
        };
        mediaRecorder.onstart = event => {
            logger.log("录音已开始");
        };
        mediaRecorder.onresume = event => {
            logger.log("录音已继续");
        };
        mediaRecorder.stop();
    }
    return mediaRecorder;
}
