"use client";
import {
    get
} from 'react-intl-universal';
import {
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
const AlertDialog = dynamic(() => import("../../components/dialog/AlertDialog"));
import calc from './generatePis';
import CopyButton from '../../components/CopyButton';
function PI(): JSX.Element {
    const [weishu, setWeishu] = useState<number>(1),
        [useAlertShow, setUseAlertShow] = useState<boolean>(false),
        [showInfoDialog, setShowInfoDialog] = useState<boolean>(false),
        [dialogInfo, setDialogInfo] = useState<string>(""),
        [out, setOut] = useState("");
    function proc(ws: number) {
        const retinfo: string = calc(ws);
        if (useAlertShow) {
            setDialogInfo(retinfo);
            return setShowInfoDialog(true);
        }
        return setOut(retinfo);
    };
    return (
        <>
            <Box id="input">
                <TextField id="weishu" label={get('pi.π的小数点后位数')} variant="outlined" value={weishu} type="number" onChange={event => {
                    var ws = Number(event.target.value);
                    setWeishu(ws);
                    proc(ws);
                }} />
            </Box>
            <FormGroup>
                <FormControlLabel control={
                    <Switch checked={useAlertShow} onClick={event => setUseAlertShow(old => !old)} />
                } label={get('用提示框显示结果')} />
            </FormGroup>
            {!useAlertShow && <Box id="out">
                <Typography variant="h4" gutterBottom>{get('结果')}</Typography>
                <CopyButton add={{
                    variant: "contained"
                }}>
                    {out}
                </CopyButton>
                <Typography variant="body1" sx={{
                    wordBreak: "break-all"
                }} gutterBottom>{get('pi.π是：')}{out}</Typography>
            </Box>}
            <AlertDialog open={showInfoDialog} title={get('提示')} description={dialogInfo} onDone={() => {
                setShowInfoDialog(false);
            }} />
        </>
    );
};
export default PI;
