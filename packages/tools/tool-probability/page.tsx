"use client";
import {
    GlobalStyles,
    TextField
} from "@mui/material";
import {
    useMemo,
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
export default function Probability() {
    const [datas, setDatas] = useState<Map<any, number>>(new Map()),
        [times, setTimes] = useState(defaultTimes),
        objectData = useMemo(() => [...datas.entries()].map(data => ({
            x: data[0],
            y: data[1]
        })), [datas]);
    return (
        <Editor run={code => {
            const executing = new Function(code),
                dataArray = [...range(times - 1)].map(() => executing()),
                map = new Map(dataArray.map(data => [data, 0]));
            dataArray.forEach(data => {
                map.set(data, (map.get(data) as number) + 1);
            });
            setDatas(map);
        }} tip={get("probability.tip")}>
            <TextField
                fullWidth
                value={times}
                onChange={event => setTimes(+event.target.value)}
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
                <VictoryBar data={objectData} />
            </VictoryChart>
        </Editor>
    );
}
