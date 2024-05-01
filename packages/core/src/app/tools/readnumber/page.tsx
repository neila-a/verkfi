"use client";
import {
    FormGroup,
    Grid,
    TextField,
    Typography
} from "@mui/material";
import Nzh from "nzh";
import {
    useId,
    useState
} from "react";
import {
    get
} from 'react-intl-universal';
const nzh = new Nzh({
    ch: '零一二三四五六七八九',
    ch_u: '个十百千万亿兆京垓姊穰沟涧正载极',
    ch_f: '负',
    ch_d: '点',
    m_u: '元角分厘',
    m_t: '人民币',
    m_z: '正'
}); // 数字转汉字这种功能不需要什么国际化
export default function ReadNumber(): JSX.Element {
    const [blur, setBlur] = useState<"number" | "string">("number"),
        [string, setString] = useState<string>(""),
        [number, setNumber] = useState<string>("0"),
        stringId = useId(),
        numberId = useId();
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
                        <Typography id={numberId} gutterBottom>
                            {get('数字')}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <TextField value={number} type="number" fullWidth InputLabelProps={{
                            shrink: true,
                            "aria-labelledby": numberId
                        }} onChange={event => {
                            const {
                                value
                            } = event.target;
                            setBlur("number");
                            setNumber(value);
                            proc(value);
                        }} />
                    </Grid>
                </Grid>
                <Grid container spacing={1} alignItems="center">
                    <Grid item>
                        <Typography id={stringId} gutterBottom>
                            {get('汉字')}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <TextField InputLabelProps={{
                            "aria-labelledby": stringId
                        }} value={string} fullWidth onChange={event => {
                            const {
                                value
                            } = event.target;
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
