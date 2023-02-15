import {
    Button,
    TextField
} from "@mui/material";
import LpLogger from "lp-logger";
import Nzh from "nzh";
import {
    useState
} from "react";
export const logger = new LpLogger({
    name: "ReadNumber",
    level: "log", // 空字符串时，不显示任何信息
});
export const nzh = new Nzh({
    ch: "零一二三四五六七八九",
    ch_u: "个十百千万亿兆京垓姊穰沟涧正载极",
    ch_f: "负",
    ch_d: "点",
    m_u: "元角分厘",
    m_t: "人民币",
    m_z: "正"
});
export default function ReadNumber(): JSX.Element {
    var [blur, setBlur] = useState<"number" | "string">("number"),
        [string, setString] = useState<string>(""),
        [number, setNumber] = useState<number>(0);
    function proc() {
        switch (blur) {
            case "number":
                setString(nzh.encode(number));
                break;
            case "string":
                setNumber(Number(nzh.decode(string)));
                break;
        }
    }
    return (
        <>
            <TextField label="数字" value={number} type="number" InputLabelProps={{
                shrink: true,
            }} onChange={event => {
                setBlur("number");
                setNumber(Number(event.currentTarget.value));
                proc();
            }} />
            <TextField label="汉字" value={string} onChange={event => {
                setBlur("string");
                setString(event.currentTarget.value);
                proc();
            }} />
            <Button variant="contained" onClick={proc}>
                转换
            </Button>
        </>
    );
};