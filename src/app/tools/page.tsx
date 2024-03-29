"use client";
import {
    useState
} from "react";
import {
    Button
} from "@mui/material";
import {
    useSpeechRecognition
} from "react-speech-kit";
export default function Speech() {
    const [action, setAction] = useState<"start" | "end">("start"),
        {
            listen,
            listening,
            stop
        } = useSpeechRecognition({
            onResult: (result) => {
                setRecognizedText(result);
            },
        }),
        [recognizedText, setRecognizedText] = useState<string>("");
    return (
        <>
            {recognizedText}
            <br />
            <Button variant="contained" onClick={event => {
                setAction(old => {
                    if (old === "start") {
                        listen();
                        return "end";
                    }
                    stop();
                    return "start";
                });
            }}>
                click to {action}
            </Button>
        </>
    );
}