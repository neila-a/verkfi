"use client";
import I18N from 'react-intl-universal';
import React, {
    useState
} from "react";
import {
    Typography,
    FormGroup,
    FormControlLabel,
    Switch,
    TextField,
    Button,
    Snackbar
} from "@mui/material";
import dynamic from 'next/dynamic';
import calc from './generatePis';
const AlertDialog = dynamic(() => import("../../components/dialog/AlertDialog"));
import {
    logger
} from './consts';
function PI(): JSX.Element {
    var [weishu, setWeishu] = useState<number>(1),
        [useAlertShow, setUseAlertShow] = useState<boolean>(false),
        [showInfoDialog, setShowInfoDialog] = useState<boolean>(false),
        [showCopyDoneDialog, setShowCopyDoneDialog] = useState<boolean>(false),
        [dialogInfo, setDialogInfo] = useState<string>(""),
        [out, setOut] = useState("");
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
            <style jsx>{`
                div#input > *, #isUseAlertShow, #outendwm {
                    margin-left: 2%;
                }
                div#out {
                    margin-bottom: 50px;
                }
            `}</style>
            <div id="input">
                <TextField id="weishu" label={I18N.get('π的小数点后位数')} variant="outlined" value={weishu} type="number" onChange={event => {
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
                } label={I18N.get('用提示框显示结果')} />
            </FormGroup>
            <div id="out" style={{
                display: useAlertShow ? "none" : "block"
            }}>
                <Typography variant="h4" style={{
                    display: "inline-block"
                }} gutterBottom>{I18N.get('结果')}</Typography>
                <Button variant="contained" style={{
                    display: "inline-block"
                }} onClick={() => {
                    navigator.clipboard.writeText(out).then(() => {
                        setShowCopyDoneDialog(true);
                        logger.log("已把结果复制到剪贴板。");
                    }).catch(error => {
                        setDialogInfo(`复制结果时出现问题，报错：${error}`);
                        logger.error(`糟糕！出错了：${error}`);
                    });
                }}>{I18N.get('复制')}</Button>
                <Typography variant="body1" sx={{
                    wordBreak: "break-all"
                }} gutterBottom>{I18N.get('π是：')}{out}</Typography>
            </div>
            {showInfoDialog && <AlertDialog title={I18N.get('提示')} description={dialogInfo} onDone={() => {
                setShowInfoDialog(false);
            }} />}
            <Snackbar open={showCopyDoneDialog} message={I18N.get('已把结果复制至剪贴板。')} onClose={() => {
                setShowCopyDoneDialog(false);
            }} />
        </>
    );
};
export default PI;
