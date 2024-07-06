"use client";
import {
    Box,
    FormControlLabel,
    FormGroup,
    Switch,
    TextField,
    Typography
} from "@mui/material";
import CopyButton from "@verkfi/shared/CopyButton";
import dynamic from "next/dynamic";
import {
    useState
} from "react";
import {
    get
} from "react-intl-universal";
import generatePis from "./generatePis";
const AlertDialog = dynamic(() => import("@verkfi/shared/dialog/Alert"));
function PI() {
    const [digits, setDigits] = useState(1),
        [useAlertShow, setUseAlertShow] = useState(false),
        [showInfoDialog, setShowInfoDialog] = useState(false),
        [dialogInfo, setDialogInfo] = useState(""),
        [out, setOut] = useState("");
    return (
        <>
            <FormGroup>
                <TextField id="digit" label={get("pi.π的小数点后位数")} variant="outlined" value={digits} type="number" onChange={event => {
                    const digit = Math.round(Number(event.target.value));
                    setDigits(digit);
                    const retinfo: string = generatePis(digit);
                    if (useAlertShow) {
                        setDialogInfo(retinfo);
                        return setShowInfoDialog(true);
                    }
                    return setOut(retinfo);
                }} />
                <FormControlLabel control={
                    <Switch checked={useAlertShow} onClick={event => setUseAlertShow(old => !old)} />
                } label={get("用提示框显示结果")} />
            </FormGroup>
            {!useAlertShow && <Box id="out">
                <Typography variant="h4" gutterBottom>
                    {get("结果")}
                </Typography>
                <CopyButton add={{
                    variant: "contained",
                    sx: {
                        mb: 1
                    }
                }}>
                    {out}
                </CopyButton>
                <Typography variant="body1" sx={{
                    wordBreak: "break-all"
                }} gutterBottom>
                    {get("pi.π是：")}{out}
                </Typography>
            </Box>}
            <AlertDialog open={showInfoDialog} title={get("提示")} description={dialogInfo} onDone={() => {
                setShowInfoDialog(false);
            }} />
        </>
    );
}
export default PI;
