"use client";
import I18N from 'react-intl-universal';
import Center from "../../components/center/Center";
import React, {
    useState
} from "react";
import {
    Button,
    TextField
} from "@mui/material";
import style from "./ShaiZi.module.scss";
import FullScreenDialog from "../../components/dialog/FullScreenDialog";
import {
    ShaiZiCanvas
} from "./shaiziCanvas";
function ShaiZi(): JSX.Element {
    var [useDialogShow, setUseDialogShow] = useState<boolean>(false),
        [cishu, setCishu] = useState<number>(1);
    return (
        <div className={style["allWidth"]}>
            <Center>
                <ShaiZiCanvas cishu={cishu} setCishu={setCishu} />
                <br />
                <br />
                <TextField id="weishu" label={I18N.get('掷色子的次数')} variant="outlined" value={cishu} type="number" onChange={event => {
                    setCishu(Number(event.target.value));
                }} />
                <br />
                <br />
                <Button variant="contained" onClick={event => {
                    setUseDialogShow(true);
                }}>{I18N.get('全屏')}</Button>
            </Center>
            {useDialogShow && <FullScreenDialog title={I18N.get('掷色子（全屏模式）')} onDone={() => {
                setUseDialogShow(false);
            }} context={<ShaiZiCanvas cishu={cishu} setCishu={setCishu} />} />}
        </div>
    );
};
export default ShaiZi;
