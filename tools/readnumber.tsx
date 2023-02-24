import {
    Button,
    TextField
} from "@mui/material";
import LpLogger from "lp-logger";
import Nzh from "nzh";
import {
    useState
} from "react";
export const logger = new LpLogger({
    name: "ReadNumber",
    level: "log", // 空字符串时，不显示任何信息
});
export const nzh = new Nzh({
    ch: "零一二三四五六七八九",
    ch_u: "个十百千万亿兆京垓姊穰沟涧正载极",
    ch_f: "负",
    ch_d: "点",
    m_u: "元角分厘",
    m_t: "人民币",
    m_z: "正"
});
/**
 * 把含有科学计数法的数字转换为字符串
 * @param num_str 要转换的大数字
 * @returns string
 */
export function numberParse(num_str: number | string): string {
    num_str = num_str.toString();
    if (num_str.indexOf("+") != -1) {
        num_str = num_str.replace("+", "");
    }
    if (num_str.indexOf("E") != -1 || num_str.indexOf("e") != -1) {
        var resValue = "",
            power: number | string = "",
            result = null,
            dotIndex = 0,
            resArr = [],
            sym = "";
        var numStr = num_str.toString();
        if (numStr[0] == "-") {
            // 如果为负数，转成正数处理，先去掉‘-’号，并保存‘-’.
            numStr = numStr.substr(1);
            sym = "-";
        }
        if (numStr.indexOf("E") != -1 || numStr.indexOf("e") != -1) {
            var regExp = new RegExp(
                "^(((\\d+.?\\d+)|(\\d+))[Ee]{1}((-(\\d+))|(\\d+)))$",
                "ig"
            );
            result = regExp.exec(numStr);
            if (result != null) {
                resValue = result[2];
                power = result[5];
                result = null;
            }
            if (!resValue && !power) {
                return "false";
            }
            dotIndex = resValue.indexOf(".") == -1 ? 0 : resValue.indexOf(".");
            resValue = resValue.replace(".", "");
            resArr = resValue.split("");
            if (Number(power) >= 0) {
                var subres = resValue.substr(dotIndex);
                power = Number(power);
                //幂数大于小数点后面的数字位数时，后面加0
                for (var i = 0; i <= power - subres.length; i++) {
                    resArr.push("0");
                }
                if (power - subres.length < 0) {
                    resArr.splice(dotIndex + power, 0, ".");
                }
            } else {
                power = String(power).replace("-", "");
                power = Number(power);
                //幂数大于等于 小数点的index位置, 前面加0
                for (var i = 0; i < power - dotIndex; i++) {
                    resArr.unshift("0");
                }
                var n = power - dotIndex >= 0 ? 1 : -(power - dotIndex);
                resArr.splice(n, 0, ".");
            }
        }
        resValue = resArr.join("");

        return sym + resValue;
    } else {
        return num_str;
    }
}
export default function ReadNumber(): JSX.Element {
    var [blur, setBlur] = useState<"number" | "string">("number"),
        [string, setString] = useState<string>(""),
        [number, setNumber] = useState<number>(0);
    function proc(p: string) {
        switch (blur) {
            case "number":
                setString(nzh.encode(p));
                break;
            case "string":
                setNumber(Number(nzh.decode(p)));
                break;
        }
    }
    return (
        <>
            <br />
            <TextField label="数字" value={numberParse(number)} type="number" fullWidth InputLabelProps={{
                shrink: true,
            }} onChange={event => {
                const { value } = event.target;
                setBlur("number");
                setNumber(Number(value));
                proc(value);
            }} />
            <TextField label="汉字" value={string} fullWidth onChange={event => {
                const { value } = event.target;
                setBlur("string");
                setString(value);
                proc(value);
            }} />
        </>
    );
};