"use client";
import "react-h5-audio-player/lib/styles.css";
import AudioPlayer from "react-h5-audio-player";
import {
    useVoiceVisualizer,
    VoiceVisualizer
} from "react-voice-visualizer";
import {
    useEffect
} from "react";
import {
    FilePond
} from "react-filepond"; // Import React FilePond
import {
    get
} from "react-intl-universal";
import useBlobState from "@verkfi/shared/useBlobState";
import Module from "./Module";
import {
    useTheme
} from "@mui/material";
function AudioTools() {
    const theme = useTheme(),

        [loopAudioSrc, setLoopAudioSrc] = useBlobState(),
        [loopSpeakAudioSrc, setLoopSpeakAudioSrc] = useBlobState(),

        // Initialize the recorder controls using the hook
        recorderControls = useVoiceVisualizer(),
        {
            // ... (Extracted controls and states, if necessary)
            recordedBlob,
            audioRef
        } = recorderControls;

    // Get the recorded audio blob
    useEffect(() => {
        if (!recordedBlob) return;

        setLoopSpeakAudioSrc(recordedBlob);
    }, [recordedBlob, setLoopSpeakAudioSrc]);

    return <>
        <Module title="音频循环播放">
            <AudioPlayer
                loop
                src={loopAudioSrc}
            />
            <FilePond
                files={[]}
                onupdatefiles={audios => audios.forEach(audio => setLoopAudioSrc(audio.file))}
                allowMultiple
                maxFiles={1}
                name="files"
                acceptedFileTypes={["audio/*"]}
                labelIdle={get("drag.拖拽音频到这里")}
            />
        </Module>
        <Module title="音频录制并循环">
            <AudioPlayer
                loop
                src={loopSpeakAudioSrc}
            />
            <VoiceVisualizer
                // @ts-ignore 这个属性官方文档就有
                ref={audioRef}
                onlyRecording
                backgroundColor={theme.palette.background.paper}
                mainBarColor={theme.palette.primary.main}
                secondaryBarColor={theme.palette.secondary.main}
                controls={recorderControls}
            />
        </Module>
    </>;
}
export default AudioTools;
