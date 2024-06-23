"use client";
import {
    GlobalStyles,
    TextField
} from "@mui/material";
import {
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
import Editor from "@verkfi/shared/Editor";
import range from "@verkfi/shared/range";
const defaultTimes = 10;
export default function Probability(): JSX.Element {
    const [datas, setDatas] = useState([]),
        [times, setTimes] = useState(defaultTimes),
        objectDatas: {
            x: any,
            y: number
        }[] = [];
    datas.forEach(data => {
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
        <Editor run={code => {
            const executing = new Function(code);
            setDatas([...range(times - 1)].map(() => executing()));
        }} tip={get("probability.tip")}>
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
                    maxWidth: "50vh"
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
        </Editor>
    );
}
