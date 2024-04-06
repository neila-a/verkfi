"use client";
import {
    get
} from 'react-intl-universal';
import {
    useState
} from "react";
import {
    Button,
    Stack,
    TextField
} from "@mui/material";
import dynamic from 'next/dynamic';
const FullScreenDialog = dynamic(() => import("dialog/FullScreen"));
import {
    ShaiZiCanvas
} from "./shaiziCanvas";
function ShaiZi(): JSX.Element {
    const [useDialogShow, setUseDialogShow] = useState<boolean>(false),
        [cishu, setCishu] = useState<number>(10);
    return (
        <>
            <Stack spacing={2} component="section">
                <ShaiZiCanvas cishu={cishu} />
                <TextField id="weishu" label={get('shaizi.掷色子的次数')} variant="outlined" value={cishu} type="number" onChange={event => {
                    setCishu(Number(event.target.value));
                }} />
                <Button variant="contained" onClick={event => {
                    setUseDialogShow(true);
                }}>{get('shaizi.全屏')}</Button>
            </Stack>
            <FullScreenDialog open={useDialogShow} title={get('shaizi.掷色子（全屏模式）')} onDone={() => {
                setUseDialogShow(false);
            }} context={<ShaiZiCanvas cishu={cishu} />} />
        </>
    );
};
export default ShaiZi;
