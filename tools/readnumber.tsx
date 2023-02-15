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
    var [blur, setBlur] = useState<"number" | "string">("number");
    var [text, setText] = useState<string>("");
    function proc() {
        switch (blur) {
            case "number":
                setText(nzh.encode(text));
                break;
            case "string":
                setText(nzh.decode(text));
                break;
        }
    }
    return (
        <>
            <TextField label="数字" value={nzh.decode(text)} onChange={event => {
                setBlur("number");
                setText(event.currentTarget.value);
                proc();
            }} />
            <TextField label="汉字" value={nzh.encode(text)} onChange={event => {
                setBlur("string");
                setText(event.currentTarget.value);
                proc();
            }}/>
            <Button variant="contained" onClick={proc}>
                转换
            </Button>
        </>
    );
};