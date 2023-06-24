import {
    Button
} from "@mui/material";
import LpLogger from "lp-logger";
import {
    useState,
    Fragment
} from "react";
import {
    InputDialog,
    AlertDialog
} from "../components/Dialog";
import style from "../styles/CountLetter.module.scss"
var logger = new LpLogger({
    name: "CountLetter",
    level: "log", // 空字符串时，不显示任何信息
});
import table from "./countletter/table";
function CountLetter(): JSX.Element {
    var [enterDialogOpen, setEnterDialogOpen] = useState<boolean>(false),
        [alertDialogOpen, setAlertDialogOpen] = useState<boolean>(false),
        [out, setOut] = useState<string>("");
    return (
        <div className={style["main"]}>
            <br />
            <Button onClick={() => {
                logger.log("已弹出输入框。");
                setEnterDialogOpen(true);
            }} variant="contained" className={style["button"]}>输入</Button>
            {enterDialogOpen ? <InputDialog context="输入你要转换的字符（串）" onDone={context => {
                table.forEach(single => {
                    context = context.replace(new RegExp(single[0], "g"), single[1]);
                })
                setEnterDialogOpen(false);
                setOut(context);
                setAlertDialogOpen(true);
                logger.log(`已处理完毕，结果为${context}。`);
            }} title="输入字符" label="在这里输入" /> : <Fragment /> /* 输入对话框容器 */}
            {alertDialogOpen ? <AlertDialog title="输出" description={out} onDone={() => {
                setAlertDialogOpen(false);
            }} /> : <Fragment /> /* 输出对话框容器 */}
        </div>
    );
};
export default CountLetter;