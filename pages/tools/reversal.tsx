import * as React from "react";
import {
    Typography,
    TextField,
    Alert,
    Chip,
    Button,
    Stack
} from "@mui/material";
import {
    Close
} from "@mui/icons-material";
import HeadBar from "../../components/HeadBar";
import LpLogger from "lp-logger";
export var logger = new LpLogger({
    name: "翻转",
    level: "log", // 空字符串时，不显示任何信息
    search: "logger_level", // 配置 URL 控制参数
});
declare global {  //设置全局属性
    interface Window {  //window对象属性
        words: any,
        wordList: any
        //加入对象
    }
}
export function destroyer(...arg: any[]): any[] {
    // 获取目标数组
    var newArray: any[] = arg[0]; // [1, 2, 1, 3, 2, 1, 3, 4, 2, 6]
    // 声明一个空数组，用来存储需要从`newArray`中删除的元素
    var removeArgs: any[] = [];
    for (let i: number = 1, len = arg.length; i < len; i++) {
        removeArgs.push(arg[i]);
        /*
         *  遍历次数  i  len   i < len  i++  arguments[i]  removeArgs
         *  1st     1    3     yes      2     1            [1]
         *  2nd     2    3     yes      3     2            [1,2]
         *  3rd     3    3     no
         *  end loop
         *  
         */
    }
    // 声明filter()方法的callback函数
    function isFalse(value): boolean {
        return removeArgs.indexOf(value) === -1;
        /*
         *  removeArgs = [1,2]
         *  removeArgs.indexOf(value) = ?  removeArgs.indexOf(value) === -1
         *  [1,2].indexOf(1) = 0              false
         *  [1,2].indexOf(2) = 1              false
         *
         */
    }
    return newArray.filter(isFalse);// newArray中删除1,2
}
function Reversal(): JSX.Element {
    var [wordList, setWordList] = React.useState<string[]>([]);
    var [words, setWords] = React.useState<string>("");
    var [output, setOutput] = React.useState<string>("");
    var [TTSURL, setTTSURL] = React.useState<string>("");
    var [show, setShow] = React.useState<boolean>(false);
    function procNewWord(event): void {
        setWords(event.target.value);
    };
    function saveToList(event): void {
        if (event.key == "Enter") {
            setWordList(current => [...current, words]);
            setWords("");
            logger.log("已保存至列表。");
        }
    };
    React.useEffect(() => {
        window.words = words;
        window.wordList = wordList;
    }, [words, wordList]);
    function proc(): void {
        var stageOutput: string[] = wordList;
        stageOutput.sort(() => {
            return Math.random() - 0.5;
        });
        setOutput(stageOutput.join(""));
        logger.log("已处理。");
    };
    function reset(): void {
        setWordList([]);
        setWords("");
        logger.log("已重置。");
    };
    function split(): void {
        setWordList(words.split(prompt("请输入拆分的符号，不输入则是逐字拆分")));
        logger.log("已拆分。");
    };
    function copy(): void {
        try {
            navigator.clipboard.writeText(output).then(() => {
                alert("已把结果复制到剪贴板。");
                logger.log("已把结果复制到剪贴板。");
            });
        } catch (error) {
            alert("糟糕！出错了");
            logger.error(`糟糕！出错了：${error}`);
        }
    };
    function read(): void {
        setShow(true);
        logger.log("已读取。");
    };
    return (
        <div>
            <HeadBar isIndex={false} pageName="翻转" />
            <br />
            <Alert severity="info">以空格分隔，按回车添加。</Alert>
            <br />
            <TextField fullWidth label="输入框" id="input" onKeyDown={saveToList} onChange={procNewWord} value={words} />
            <br />
            {wordList.map((item, index) => {
                return (
                    <Chip key={index} label={item} onDelete={() => {
                        setWordList(destroyer(wordList, item));
                    }} deleteIcon={<Close />} />
                );
            })}
            <br />
            <Stack direction="row" spacing={1}>
                <Button variant="contained" onClick={proc}>处理</Button>
                <Button variant="outlined" onClick={reset}>重来</Button>
                <Button variant="outlined" onClick={split}>拆分</Button>
                <Button variant="outlined" onClick={copy}>复制</Button>
                <Button variant="outlined" onClick={read}>读取</Button>
            </Stack>
            <Typography variant="body1">结果：{output}</Typography>
            <div style={{
                display: show ? "block" : "none"
            }}>
                <br />
                <iframe src={`https://fanyi.sogou.com/reventondc/synthesis?text=${output}&speed=1&lang=zh&from=translateweb&speaker=6`} title="TTS content"></iframe>
            </div>
        </div>
    );
};
export default Reversal;