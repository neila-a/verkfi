import Link from "next/link";
import Image from "next/image";
import HeadBar from "../components/HeadBar";
import * as React from 'react';
import {
    Stack,
    Card,
    CardContent,
    Typography
} from "@mui/material";
import {
    Audiotrack as AudiotrackIcon,
    Abc as ABCIcon,
    AccessTime as AccessTimeIcon,
    FlipCameraAndroid as FlipCameraAndroidIcon,
    Filter as FilterIcon
} from "@mui/icons-material";
import Style from "../styles/Index.module.scss";
import ShaiziIcon from "../public/shaizi.24x24.svg";
import PiIcon from "../public/pi.466x393.png";
export interface page {
    name: string;
    to: string;
    desc: string;
    icon: () => JSX.Element
}
export const pages: page[] = [
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
        name: "BigTime",
        to: "bigtime",
        desc: "很大的时间",
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
        desc: "随机掷筛子",
        icon: () => <Image src={ShaiziIcon} alt="筛子图标" />
    },
    {
        name: "滤镜",
        to: "filter",
        desc: "将一张图片处理成不同的（开发中）",
        icon: () => <FilterIcon />
    }
];
export default function Index(): JSX.Element {
    return (
        <>
            <HeadBar isIndex={true} pageName="NeilaTools" />
            <br />
            <Stack spacing={5} className={Style["items"]}>
                {pages.map((page, index) => {
                    const PageIcon = page.icon;
                    return (
                        <>
                            <Link href={page.to} key={page.name}>
                                <Card sx={{
                                    minWidth: 275
                                }} elevation={10}>
                                    <CardContent>
                                        <Typography variant="h5" component="div">
                                            <PageIcon />
                                            {page.name}
                                        </Typography>
                                        <Typography variant="body2">
                                            {page.desc}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Link>
                            {/* Deleted Code {(index % 2 == 1) ? <br /> : <></>} */}
                        </>
                    );
                })}
            </Stack>
        </>
    );
};