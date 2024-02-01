"use client";
import {
    get
} from 'react-intl-universal';
import React, {
    useState
} from "react";
import {
    Typography,
    FormGroup,
    FormControlLabel,
    Switch,
    TextField,
    Box
} from "@mui/material";
import dynamic from 'next/dynamic';
import calc from './generatePis';
import CopyButton from '../../components/CopyButton';
export const AlertDialog = dynamic(() => import("../../components/dialog/AlertDialog"));
function PI(): JSX.Element {
    const [weishu, setWeishu] = useState<number>(1),
        [useAlertShow, setUseAlertShow] = useState<boolean>(false),
        [showInfoDialog, setShowInfoDialog] = useState<boolean>(false),
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
            <Box id="input">
                <TextField id="weishu" label={get('pi.π的小数点后位数')} variant="outlined" value={weishu} type="number" onChange={event => {
                    var ws = Number(event.target.value);
                    setWeishu(ws);
                    proc(ws);
                }} />
            </Box>
            <FormGroup>
                <FormControlLabel control={
                    <Switch checked={useAlertShow} onClick={() => {
                        if (useAlertShow) {
                            setUseAlertShow(false);
                        } else if (!useAlertShow) {
                            setUseAlertShow(true);
                        }
                    }} />
                } label={get('用提示框显示结果')} />
            </FormGroup>
            <Box id="out" sx={{
                display: useAlertShow ? "none" : ""
            }}>
                <Box display="flex">
                    <Typography variant="h4" style={{
                        display: "inline-block"
                    }} gutterBottom>{get('结果')}</Typography>
                    <CopyButton add={{
                        variant: "contained"
                    }}>
                        {out}
                    </CopyButton>
                </Box>
                <Typography variant="body1" sx={{
                    wordBreak: "break-all"
                }} gutterBottom>{get('pi.π是：')}{out}</Typography>
            </Box>
            <AlertDialog open={showInfoDialog} title={get('提示')} description={dialogInfo} onDone={() => {
                setShowInfoDialog(false);
            }} />
        </>
    );
};
export default PI;
