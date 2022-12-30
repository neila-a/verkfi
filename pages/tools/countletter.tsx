import Link from "next/link";
import {
    Button, Divider, Stack
} from "@mui/material";
import HeadBar from "../../components/HeadBar";
import LpLogger from "lp-logger";
export var logger = new LpLogger({
    name: "CountLetter",
    level: "log", // 空字符串时，不显示任何信息
    
});
function CountLetter(): JSX.Element {
    function main() {
        logger.log("已弹出输入框。");
        alert(prompt("请输入字母：", "A")
            .replace("A", "1")
            .replace("B", "2")
            .replace("C", "3")
            .replace("D", "4")
            .replace("E", "5")
            .replace("F", "6")
            .replace("G", "7")
            .replace("H", "8")
            .replace("I", "9")
            .replace("J", "10")
            .replace("K", "11")
            .replace("L", "12")
            .replace("M", "13")
            .replace("N", "14")
            .replace("O", "15")
            .replace("P", "16")
            .replace("Q", "17")
            .replace("R", "18")
            .replace("S", "19")
            .replace("T", "20")
            .replace("U", "21")
            .replace("V", "22")
            .replace("W", "23")
            .replace("X", "24")
            .replace("Y", "25")
            .replace("Z", "26")
            .replace("a", "1")
            .replace("b", "2")
            .replace("c", "3")
            .replace("d", "4")
            .replace("e", "5")
            .replace("f", "6")
            .replace("g", "7")
            .replace("h", "8")
            .replace("i", "9")
            .replace("j", "10")
            .replace("k", "11")
            .replace("l", "12")
            .replace("m", "13")
            .replace("n", "14")
            .replace("o", "15")
            .replace("p", "16")
            .replace("q", "17")
            .replace("r", "18")
            .replace("s", "19")
            .replace("t", "20")
            .replace("u", "21")
            .replace("v", "22")
            .replace("w", "23")
            .replace("x", "24")
            .replace("y", "25")
            .replace("z", "26"));
        logger.log("已处理完毕。");
    }
    return (
        <>
            <style>{`
                .help-btn {
                    width:50%;
                    height:100%;
                    display:inline-block;
                    float:left;
                }
                .restart-btn {
                    width:50%;
                    height:100%;
                    display:inline-block;
                }
            `}</style>
            <HeadBar isIndex={false} pageName="CountLetter" />
            <Stack
                direction="row"
                divider={<Divider orientation="vertical" flexItem />}
                spacing={2}
            >
                <Button className='restart-btn' onClick={main}>输入</Button>
            </Stack>
        </>
    );
};
export default CountLetter;