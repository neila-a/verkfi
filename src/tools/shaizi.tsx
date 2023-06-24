import Center from "../components/Center";
import React, {
    Dispatch,
    SetStateAction,
    useEffect,
    useRef,
    useState
} from "react";
import {
    Button,
    TextField
} from "@mui/material";
import style from "../styles/ShaiZi.module.scss";
import LpLogger from "lp-logger";
import FullScreenDialog from "../components/dialog/FullScreenDialog";
import {
    ShaiZiCanvas
} from "./shaizi/shaiziCanvas";
export var logger = new LpLogger({
    name: "掷骰子",
    level: "log", // 空字符串时，不显示任何信息
});
export function ShaiZi(): JSX.Element {
    var [useDialogShow, setUseDialogShow] = useState<boolean>(false),
        [cishu, setCishu] = useState<number>(1);
    return (
        <div className={style["allWidth"]}>
            <Center>
                <ShaiZiCanvas cishu={cishu} setCishu={setCishu} />
                <br />
                <br />
                <TextField id="weishu" label="掷色子的次数" variant="outlined" value={cishu} type="number" onChange={event => {
                    setCishu(Number(event.target.value));
                }} />
                <br />
                <br />
                <Button variant="contained" onClick={event => {
                    setUseDialogShow(true);
                }}>全屏</Button>
            </Center>
            {useDialogShow && <FullScreenDialog title="掷色子（全屏模式）" onDone={() => {
                setUseDialogShow(false);
            }} context={<ShaiZiCanvas cishu={cishu} setCishu={setCishu} />} />}
        </div>
    );
};
export default ShaiZi;