import Link from "next/link";
import Image from "next/image";
import HeadBar from "../components/HeadBar";
import * as React from 'react';
import {
    Stack,
    Card,
    CardContent,
    Typography,
    Divider,
    IconButton,
    InputBase,
    Paper
} from "@mui/material";
import {
    Audiotrack as AudiotrackIcon,
    Abc as ABCIcon,
    AccessTime as AccessTimeIcon,
    FlipCameraAndroid as FlipCameraAndroidIcon,
    Filter as FilterIcon,
    Numbers as NumbersIcon,
    Keyboard as KeyboardIcon,
    Search as SearchIcon,
    ViewModule as ViewModuleIcon,
    ViewList as ViewListIcon
} from "@mui/icons-material";
import Style from "../styles/Index.module.scss";
import ShaiziIcon from "../public/shaizi.24x24.svg";
import PiIcon from "../public/pi.466x393.png";
import LpLogger from "lp-logger";
export var logger = new LpLogger({
    name: "Index",
    level: "log", // 空字符串时，不显示任何信息
});
export interface tool {
    name: string;
    to: string;
    desc: string;
    icon: () => JSX.Element;
}
export const realTools: tool[] = [
    {
        name: "AudioTools",
        to: "audiotools",
        desc: "复读、文本转音频",
        icon: () => <AudiotrackIcon />
    },
    {
        name: "CountLetter",
        to: "countletter",
        desc: "找出字母在26字母表中的顺序",
        icon: () => <ABCIcon />
    },
    {
        name: "时钟",
        to: "clock",
        desc: "显示自定义化的时间",
        icon: () => <AccessTimeIcon />
    },
    {
        name: "π计算器",
        to: "pi",
        desc: "计算π的小数点后任意位",
        icon: () => <Image src={PiIcon} alt="圆周率图标" height={24} width={24} />
    },
    {
        name: "翻转",
        to: "reversal",
        desc: "随机翻转字符串",
        icon: () => <FlipCameraAndroidIcon />
    },
    {
        name: "掷骰子",
        to: "shaizi",
        desc: "随机掷骰子",
        icon: () => <Image src={ShaiziIcon} alt="骰子图标" />
    },
    {
        name: "滤镜",
        to: "filter",
        desc: "将一张图片处理成不同的",
        icon: () => <FilterIcon />
    },
    {
        name: "按键编码",
        to: "keycode",
        desc: "查询一个按键的编码",
        icon: () => <KeyboardIcon />
    },
    {
        name: "读数字",
        to: "readnumber",
        desc: "将数字转换成汉字字符串",
        icon: () => <NumbersIcon />
    }
];
export default function Index(): JSX.Element {
    var [tools, setTools] = React.useState<tool[]>(realTools);
    var [searchText, setSearchText] = React.useState<string>("");
    var [viewMode, setViewMode] = React.useState<"list" | "grid">("grid");
    function searchTools() {
        var calcTools: tool[] = [];
        realTools.forEach(tool => {
            if (tool.desc.includes(searchText) || tool.to.includes(searchText) || tool.name.includes(searchText)) calcTools.push(tool);
        });
        setTools(calcTools);
    };
    return (
        <>
            <HeadBar isIndex={true} pageName="NeilaTools" />
            <br />
            <Paper component="form" sx={{ // 搜索栏
                p: '2px 4px',
                display: 'flex',
                alignItems: 'center'
            }}>
                <IconButton type="button" sx={{
                    p: '10px'
                }} aria-label="search" onClick={searchTools}>
                    <SearchIcon />
                </IconButton>
                <InputBase sx={{
                    ml: 1,
                    flex: 1
                }} placeholder="搜索工具" inputProps={{
                    'aria-label': 'searchtools',
                    onChange: event => setSearchText(event.currentTarget.value),
                    onKeyDown: event => {
                        if (event.key == "Enter") {
                            searchTools();
                        }
                    }
                }} />
                <Divider sx={{
                    height: 28,
                    m: 0.5
                }} orientation="vertical" />
                <IconButton color="primary" sx={{
                    p: '10px'
                }} aria-label="directions" onClick={_event => {
                    switch (viewMode) {
                        case "grid":
                            setViewMode("list");
                            break;
                        case "list":
                            setViewMode("grid");
                            break;
                    };
                }}>
                    {viewMode == "grid" ? <ViewListIcon /> : <ViewModuleIcon />}
                </IconButton>
            </Paper>
            <br />
            <Stack spacing={5} className={viewMode == "grid" ? Style["items-grid"] : ""} sx={{
                flexDirection: viewMode == "grid" ? "" : "row",
                display: viewMode == "grid" ? "flex" : "block"
            }}> {/* 工具总览 */}
                {tools.map((tool, _index, _array) => { // 遍历tools
                    const ToolIcon = tool.icon;
                    return (
                        <> {/* 单个工具 */}
                            <Link href={`/tools/${tool.to}`} key={tool.name}>
                                <Card sx={viewMode == "grid" ? {
                                    minWidth: 275
                                } : {
                                    minWidth: "100%"
                                }} elevation={10}>
                                    <CardContent>
                                        {viewMode == "grid" ? <>
                                            <Typography variant="h5" component="div">
                                                <ToolIcon />
                                                {tool.name}
                                            </Typography>
                                            <Typography variant="body2">
                                                {tool.desc}
                                            </Typography>
                                        </> : <>
                                            <Typography variant="body2">
                                                <ToolIcon />{tool.name} - {tool.desc}
                                            </Typography>
                                        </>}
                                    </CardContent>
                                </Card>
                            </Link>
                            {viewMode == "grid" ? <></> : <br />}
                        </>
                    );
                })}
            </Stack>
        </>
    );
};