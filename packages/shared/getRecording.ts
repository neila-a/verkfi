import isBrowser from "./isBrowser";
import LpLogger from "lp-logger";
export default async function getRecording(
    onStop: (blob: Blob) => any,
    onDataAvailable: (blob: Blob) => any
) {
    let mediaRecorder = undefined as unknown as MediaRecorder;
    const logger = new LpLogger({
        name: "AudioTools",
        level: "log" // 空字符串时，不显示任何信息
    });
    // 可以相信浏览器必支持这个API，因为 Verkfi 核心所需要的浏览器版本就很高
    if (isBrowser()) {
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
        mediaRecorder.addEventListener("dataavailable", event => {
            chunks.push(event.data);
            onDataAvailable(new Blob([chunks[0], event.data], {
                type: mimeType
            }));
        });
        mediaRecorder.addEventListener("stop", event => {
            logger.log("录音已停止。");
            onStop(new Blob(chunks, {
                type: mimeType
            }));
            chunks.splice(0, chunks.length);
        });
        mediaRecorder.stop();
    }
    return mediaRecorder;
}
