"use client";
import {
    useRef,
    useState
} from "react";
import {
    Button,
    ButtonGroup
} from "@mui/material";
import {
    status
} from "../audiotools/page";
import {
    Download,
    PlayArrow,
    Stop
} from "@mui/icons-material";
import useRecording from "../audiotools/useRecording";
import {
    saveAs
} from "file-saver";
const statuses: status[] = ["recording", "paused", "inactive"];
export default function Speech() {
    const [status, setStatus] = useState<status>("inactive"),
        audioFile = useRef<Blob>(new Blob(["Why you downloaded this??? Do not do it!!!"])),
        mediaRecorder = useRecording(blob => {
            audioFile.current = blob;
        }, blob => {

        });
    var button = <></>;
    switch (status) {
        case "recording":
            button = <Button startIcon={<Stop />} variant="contained" onClick={event => {
                (mediaRecorder.current as MediaRecorder).stop();
            }}>
                stop
            </Button>;
        case "paused":
        case "inactive":
            button = <Button startIcon={<PlayArrow />} variant="contained" onClick={event => {
                (mediaRecorder.current as MediaRecorder).start();
            }}>
                start
            </Button>;
    }
    return (
        <>
            <ButtonGroup>
                {button}
                <Button variant="outlined" startIcon={<Download />} onClick={event => {
                    saveAs(audioFile.current);
                }}>
                    download
                </Button>
            </ButtonGroup>
        </>
    );
}