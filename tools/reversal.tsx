import React, {
    useState,
    useEffect
} from "react";
import {
    Typography,
    TextField,
    Alert,
    Chip,
    Button,
    ButtonGroup
} from "@mui/material";
import {
    Close
} from "@mui/icons-material";
import LpLogger from "lp-logger";
import { AlertDialog, InputDialog } from "../components/Dialog";
export var logger = new LpLogger({
    name: "翻转",
    level: "log", // 空字符串时，不显示任何信息
});
declare global {  //设置全局属性
    interface Window {  //window对象属性
        words: any,
        wordList: any
        //加入对象
    }
}
/**
 * 从数组里删除项目
 * @param any[] 用来删除的数组
 * @param any 要删除的项目值
 * @returns 删除完毕的数组
 */
export function destroyer<T = any>(array: T[], ...arg: any[]): T[] {
    // 获取目标数组
    var newArray: T[] = array; // [1, 2, 1, 3, 2, 1, 3, 4, 2, 6]
    // 声明一个空数组，用来存储需要从`newArray`中删除的元素
    var removeArgs: T[] = [];
    for (let i: number = 0, len = arg.length; i < len; i++) {
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
export function Reversal(): JSX.Element {
    var [wordList, setWordList] = useState<[string, number][]>([]),
        [words, setWords] = useState<string>(""),
        [output, setOutput] = useState<string>(""),
        [showCopyErrorDialog, setShowCopyErrorDialog] = useState<boolean>(false),
        [copyError, setCopyError] = useState<string>(""),
        [showSplitDialog, setShowSplitDialog] = useState<boolean>(false),
        [showCopyDoneDialog, setShowCopyDoneDialog] = useState<boolean>(false);
    useEffect(() => {
        window.words = words;
        window.wordList = wordList;
    }, [words, wordList]);
    return (
        <>
            <Alert severity="info">以空格分隔，按回车添加。</Alert>
            <TextField fullWidth label="输入框" id="input" onKeyDown={event => {
                if (event.key == "Enter") {
                    setWordList(current => [...current, [
                        words,
                        Math.random() * 10000000000000000
                    ]]);
                    setWords("");
                    logger.log("已保存至列表。");
                }
            }} onChange={event => {
                setWords(event.target.value);
            }} value={words} />
            {wordList.map(wordArray => {
                return (
                    <Chip key={wordArray[1]} label={wordArray[0]} onDelete={() => {
                        setWordList(oldWordList => destroyer(oldWordList, wordArray));
                    }} deleteIcon={<Close />} />
                );
            })}
            <br />
            <ButtonGroup>
                <Button variant="contained" onClick={() => {
                    var stageOutput: [string, number][] = wordList;
                    stageOutput.sort(() => {
                        return Math.random() - 0.5;
                    });
                    setOutput(stageOutput.map(wordArray => {
                        return wordArray[0];
                    }).join(""));
                    logger.log("已处理。");
                }}>处理</Button>
                <Button variant="outlined" onClick={() => {
                    setWordList([]);
                    setWords("");
                    setOutput("");
                    logger.log("已重置。");
                }}>重来</Button>
                <Button variant="outlined" onClick={() => {
                    setShowSplitDialog(true);
                    logger.log("已打开输入对话框。");
                }}>拆分</Button>
                <Button variant="outlined" onClick={() => {
                    navigator.clipboard.writeText(output).then(() => {
                        setShowCopyDoneDialog(true);
                    }).catch(error => {
                        setCopyError(`复制结果时出现错误，请报告给开发人员：${error}`);
                        setShowCopyErrorDialog(true);
                    });
                }}>复制</Button>
            </ButtonGroup>
            <Typography variant="body1">结果：{output}</Typography>
            {showCopyErrorDialog && <AlertDialog onDone={() => {
                setShowCopyErrorDialog(false);
            }} title="复制出现错误" description={copyError} />}
            {showSplitDialog && <InputDialog label="" title="拆分" context="请输入拆分的符号，不输入则是逐字拆分" onDone={context => {
                setWordList(words.split(context).map(word => {
                    return [
                        word,
                        Math.random() * 10000000000000000
                    ];
                }));
                logger.log("已拆分。");
                setShowSplitDialog(false);
            }} />}
            {showCopyDoneDialog && <AlertDialog title="复制完毕" description="已把结果复制至剪贴板。" onDone={() => {
                setShowCopyDoneDialog(false);
            }}/>}
        </>
    );
};
export default Reversal;