import {
    FormGroup,
    Grid,
    TextField,
    Typography
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
        [number, setNumber] = useState<string>("0");
    function proc(p: string) {
        switch (blur) {
            case "number":
                setString(nzh.encode(p));
                break;
            case "string":
                setNumber(nzh.decode(p));
                break;
        }
    }
    return (
        <>
            <FormGroup>
                <Grid container spacing={1} alignItems="center">
                    <Grid item>
                        <Typography id="number" gutterBottom>
                            数字
                        </Typography>
                    </Grid>
                    <Grid item>
                    <TextField value={number} type="number" fullWidth InputLabelProps={{
                        shrink: true,
                        "aria-labelledby": "number"
                    }} onChange={event => {
                        const { value } = event.target;
                        setBlur("number");
                        setNumber(value);
                        proc(value);
                    }} />
                    </Grid>
                </Grid>
                <Grid container spacing={1} alignItems="center">
                    <Grid item>
                        <Typography id="string" gutterBottom>
                            汉字
                        </Typography>
                    </Grid>
                    <Grid item>
                    <TextField InputLabelProps={{
                        "aria-labelledby": "string"
                    }} value={string} fullWidth onChange={event => {
                        const { value } = event.target;
                        setBlur("string");
                        setString(value);
                        proc(value);
                    }} />
                    </Grid>
                </Grid>
            </FormGroup>
        </>
    );
};