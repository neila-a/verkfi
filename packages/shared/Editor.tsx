"use client";
import {
    Editor as Monaco
} from "@monaco-editor/react";
import {
    Download,
    PlayArrow,
    Upload
} from "@mui/icons-material";
import {
    Box,
    Button,
    ButtonGroup,
    useTheme
} from "@mui/material";
import saveAs from "file-saver";
import {
    toText
} from "file-to-any";
import Loading from "loading";
import {
    ReactNode,
    useRef,
    useState
} from "react";
import {
    get
} from "react-intl-universal";
export default function Editor(props: {
    run(code: string): any;
    children?: ReactNode;
    tip: string;
}): JSX.Element {
    const [code, setCode] = useState(`// ${props.tip}`),
        theme = useTheme(),
        inputRef = useRef<HTMLInputElement>();
    return (
        <>
            <ButtonGroup fullWidth sx={{
                mb: 2
            }}>
                <Button variant="outlined" onClick={event => {
                    inputRef?.current?.click();
                }} startIcon={(
                    <Upload />
                )}>
                    {get("probability.import")}
                </Button>
                <Button variant="contained" onClick={event => {
                    props.run(code);
                }} startIcon={(
                    <PlayArrow />
                )}>
                    {get("run")}
                </Button>
                <Button variant="outlined" onClick={event => {
                    const blob = new Blob([code], {
                        type: "text/plain;charset=utf-8"
                    });
                    saveAs(blob);
                }} startIcon={(
                    <Download />
                )}>
                    {get("probability.export")}
                </Button>
            </ButtonGroup>
            {props.children}
            <Box sx={{
                height: "30vh"
            }}>
                <Monaco value={code} onChange={(value, event) => {
                    setCode(value);
                }} theme={theme.palette.mode === "light" ? "light" : "vs-dark"} language="javascript" loading={(
                    <Loading />
                )} />
            </Box>
            <input type="file" style={{
                display: "none"
            }} onChange={async event => {
                if (event.target.files.length > 0) {
                    const file = event.target.files[0],
                        string = await toText(file);
                    setCode(string);
                }
            }} ref={inputRef} />
        </>
    );
}
