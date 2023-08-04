import I18N from 'react-intl-universal';
import {
    Button
} from "@mui/material";
import LpLogger from "lp-logger";
import {
    useState,
    Fragment
} from "react";
import InputDialog from "../../components/dialog/InputDialog";
import AlertDialog from "../../components/dialog/AlertDialog";
import style from "./CountLetter.module.scss"
var logger = new LpLogger({
    name: "CountLetter",
    level: "log", // 空字符串时，不显示任何信息
});
import table from "./table";
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
            }} variant="contained" className={style["button"]}>{I18N.get('输入')}</Button>
            {enterDialogOpen ? <InputDialog context={I18N.get('输入你要转换的字符（串）')} onDone={context => {
                table.forEach(single => {
                    context = context.replace(new RegExp(single[0], "g"), single[1]);
                })
                setEnterDialogOpen(false);
                setOut(context);
                setAlertDialogOpen(true);
                logger.log(`已处理完毕，结果为${context}。`);
            }} title={I18N.get('输入字符')} label={I18N.get('在这里输入')} /> : <Fragment /> /* 输入对话框容器 */}
            {alertDialogOpen ? <AlertDialog title={I18N.get('输出')} description={out} onDone={() => {
                setAlertDialogOpen(false);
            }} /> : <Fragment /> /* 输出对话框容器 */}
        </div>
    );
};
export default CountLetter;
