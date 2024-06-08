"use client";
import Editor from "@monaco-editor/react";
import {
    Download,
    PlayArrow,
    Upload
} from "@mui/icons-material";
import {
    Box,
    Button,
    ButtonGroup,
    GlobalStyles,
    TextField,
    useTheme
} from "@mui/material";
import saveAs from "file-saver";
import {
    toText
} from "file-to-any";
import Loading from "loading";
import {
    useRef,
    useState
} from "react";
import {
    get
} from "react-intl-universal";
import {
    VictoryTheme,
    VictoryBar,
    VictoryChart
} from "victory";
export default function Probability(): JSX.Element {
    const [code, setCode] = useState(`// ${get("probability.tip")}`),
        theme = useTheme(),
        [datas, setDatas] = useState([]),
        inputRef = useRef<HTMLInputElement>(),
        [times, setTimes] = useState(10),
        objectDatas: {
            x: any,
            y: number
        }[] = [];
    datas.map(data => {
        const index = objectDatas.findIndex(objectData => objectData.x === data);
        if (index === -1) {
            return objectDatas.push({
                x: data,
                y: 1
            });
        }
        return objectDatas[index].y += 1;
    });
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
                    const executing = new Function(code),
                        draft = [];
                    for (let i = 0; i < times; i++) {
                        draft[i] = executing();
                    }
                    setDatas(draft);
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
            <TextField
                fullWidth
                value={times}
                onChange={event => setTimes(Number(event.target.value))}
                label={get("probability.runTimes")}
                variant="outlined"
                type="number"
            />
            <GlobalStyles styles={{
                ".VictoryContainer": {
                    "max-width": "50vh"
                }
            }} />
            <VictoryChart
                theme={VictoryTheme.material}
                domainPadding={10}
            >
                <VictoryBar
                    data={objectDatas}
                />
            </VictoryChart>
            <Box sx={{
                height: "30vh"
            }}>
                <Editor value={code} onChange={(value, event) => {
                    setCode(value);
                }} theme={theme.palette.mode === "light" ? "light" : "vs-dark"} language="javascript" loading={<Loading />} />
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
