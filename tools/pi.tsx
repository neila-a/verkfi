import Head from "next/head";
import React, {
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
import LpLogger from "lp-logger";
import { AlertDialog } from "../components/Dialog";
export var logger = new LpLogger({
    name: "π计算器",
    level: "log", // 空字符串时，不显示任何信息
});
export const pi = require("pi");
function PI(): JSX.Element {
    var [weishu, setWeishu] = useState<number>(1),
        [useAlertShow, setUseAlertShow] = useState<boolean>(false),
        [showInfoDialog, setShowInfoDialog] = useState<boolean>(false),
        [dialogInfo, setDialogInfo] = useState<string>(""),
        [out, setOut] = useState("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
    function calc(ws: number): string {
        logger.log(`位数是：${ws}`);
        const ret: string = String(pi(ws));
        logger.log(`结果是：${ret}`);
        return (ret);
    }
    function proc(ws: number) {
        const retinfo: string = calc(ws);
        switch (useAlertShow) {
            case true:
                setDialogInfo(retinfo);
                setShowInfoDialog(true);
                break;
            case false:
                setOut(retinfo);
                break;
        };
    };
    return (
        <>
            <br />
            <Head>
                <style jsx>{`/*
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
            </Head>
            <div id="input">
                <TextField id="weishu" label="π的小数点后位数" variant="outlined" value={weishu} type="number" onChange={event => {
                    var ws = Number(event.target.value);
                    setWeishu(ws);
                    proc(ws);
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
                    navigator.clipboard.writeText(out).then(() => {
                        setDialogInfo("已把结果复制到剪贴板。");
                        setShowInfoDialog(true);
                        logger.log("已把结果复制到剪贴板。");
                    }).catch(error => {
                        setDialogInfo(`复制结果时出现问题，报错：${error}`);
                        logger.error(`糟糕！出错了：${error}`);
                    });
                }}>复制</Button>
                <Typography variant="body1" id="outendwm" gutterBottom>π是：{out}</Typography>
            </div>
            {showInfoDialog && <AlertDialog title="提示" description={dialogInfo} onDone={() => {
                setShowInfoDialog(false);
            }} />}
        </>
    );
};
export default PI;