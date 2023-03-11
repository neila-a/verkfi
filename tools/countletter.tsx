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
export var logger = new LpLogger({
    name: "CountLetter",
    level: "log", // 空字符串时，不显示任何信息

});
export const table: [string, string][] = [
    ["A", "1"],
    ["B", "2"],
    ["C", "3"],
    ["D", "4"],
    ["E", "5"],
    ["F", "6"],
    ["G", "7"],
    ["H", "8"],
    ["I", "9"],
    ["J", "10"],
    ["K", "11"],
    ["L", "12"],
    ["M", "13"],
    ["N", "14"],
    ["O", "15"],
    ["P", "16"],
    ["Q", "17"],
    ["R", "18"],
    ["S", "19"],
    ["T", "20"],
    ["U", "21"],
    ["V", "22"],
    ["W", "23"],
    ["X", "24"],
    ["Y", "25"],
    ["Z", "26"],
    ["a", "1"],
    ["b", "2"],
    ["c", "3"],
    ["d", "4"],
    ["e", "5"],
    ["f", "6"],
    ["g", "7"],
    ["h", "8"],
    ["i", "9"],
    ["j", "10"],
    ["k", "11"],
    ["l", "12"],
    ["m", "13"],
    ["n", "14"],
    ["o", "15"],
    ["p", "16"],
    ["q", "17"],
    ["r", "18"],
    ["s", "19"],
    ["t", "20"],
    ["u", "21"],
    ["v", "22"],
    ["w", "23"],
    ["x", "24"],
    ["y", "25"],
    ["z", "26"]
];
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