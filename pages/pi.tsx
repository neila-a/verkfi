import Head from "next/head";
import React, {
    useEffect,
    useState,
    useRef
} from "react";
import {
    Typography,
    FormGroup,
    FormControlLabel,
    Switch,
    TextField,
    Button
} from "@mui/material";
import HeadBar from "../components/HeadBar";
const pi = require("pi");
function PI(): JSX.Element {
    interface confFace {
        isuas: boolean
    };
    var conf: confFace = {
        isuas: false
    };
    var [weishu, setWeishu] = useState(1);
    var [useAlertShow, setUseAlertShow] = useState(false);
    var [out, setOut] = useState("");
    var outRef = useRef();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    function calc(): string {
        console.log(`位数是：${weishu}`);
        const ret: string = String(pi(weishu));
        return (ret);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    function proc(): void {
        const retinfo: string = calc();
        if (useAlertShow == true) {
            alert(retinfo);
        } else if (useAlertShow == false) {
            setOut(retinfo);
        }
        console.log(retinfo);
    };
    return (
        <>
            <Head>
                <style>{`/*
                    body {
                        border-radius: 100px;
                        border: 1px solid;
                        height: {{ window.screen.availHeight }}px;
                    }*/
                    #outendwm {
                        word-wrap: break-word;
                        word-break: "break-all;
                        overflow: hidden;
                    }
                    h3 {
                        text-align: center;
                        font-family: Cambria;
                    }
                    h2 {
                        padding-left: 1%;
                    }
                    div#input > *, #isUseAlertShow, #outendwm {
                        margin-left: 2%;
                    }
                    button {
                        background-color: #3399ff;
                        border-color: #3399ff;
                        border-radius: 100px;
                        color: #ffffff;
                    }
                    button:hover {
                        background-color: #ffffff;
                        color: #000000;
                    }
                    div#out {
                        margin-bottom: 50px;
                    }
                `}</style>
                <title>π计算器</title>
            </Head>
            <HeadBar isIndex={false} pageName="π计算器" />
            <Typography variant="h3" gutterBottom>π计算器</Typography>
            <div id="input">
                <TextField id="weishu" label="π的小数点后位数" variant="outlined" value={weishu} type="number" onChange={(event) => {
                    setWeishu(Number(event.target.value));
                    proc();
                }} />
            </div>
            <FormGroup>
                <FormControlLabel control={
                    <Switch checked={useAlertShow} onClick={() => {
                        if (useAlertShow) {
                            setUseAlertShow(false);
                        } else if (!useAlertShow) {
                            setUseAlertShow(true);
                        }
                    }} />
                } label="用提示框显示结果" />
            </FormGroup>
            <div id="out" style={{
                display: useAlertShow ? "none" : "block"
            }}>
                <Typography variant="h4" style={{
                    display: "inline-block"
                }} gutterBottom>结果</Typography>
                <Button variant="contained" style={{
                    display: "inline-block"
                }} onClick={() => {
                    try {
                        navigator.clipboard.writeText(out).then(() => {
                            alert("已把结果复制到剪贴板。");
                        });
                    } catch {
                        alert("糟糕！出错了");
                    }
                }}>复制</Button>
                <Typography variant="body1" id="outendwm" gutterBottom>π是：{out}</Typography>
            </div>
        </>
    );
};
export default PI;