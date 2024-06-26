"use client";
import {
    GitHub
} from "@mui/icons-material";
import {
    Box,
    Button,
    Typography
} from "@mui/material";
import VerkfiIcon from "@verkfi/shared/verkfiIcon";
import isBrowser from "@verkfi/shared/isBrowser";
import Link from "next/link";
import {
    get,
    getHTML
} from "react-intl-universal";
import pack from "../../../../package.json";
import Reset from "./reset";
import {
    Suspense
} from "react";
import Loading from "loading";
const {
    version,
    devVersion,
    author
} = pack;
export default function About() {
    const year = new Date().getFullYear(),
        initialAddressInfo = {
            host: "",
            href: "",
            pathname: "",
            port: "",
            protocol: ""
        };
    let addressInfo = initialAddressInfo;
    if (isBrowser()) {
        addressInfo = {
            href: location.href,
            host: location.hostname,
            pathname: location.pathname,
            protocol: location.protocol,
            port: location.port
        };
    }
    return (
        <>
            <Typography variant="h4">
                {get("关于")}
            </Typography>
            <Box sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mb: 4,
                flexDirection: "column"
            }}>
                <Box sx={{
                    display: "flex",
                    alignItems: "center"
                }}>
                    <Box sx={{
                        display: "flex",
                        alignItems: "center",
                        mr: 2
                    }}>
                        <VerkfiIcon sx={{
                            fontSize: "300%"
                        }} />
                        <Typography variant="h4" sx={{
                            fontWeight: 300,
                            fontSize: "300%"
                        }}>
                            Verkfi
                        </Typography>
                    </Box>
                    <Box>
                        <Typography>
                            {get("发行版本：")}{version}
                            <br />
                            {get("内部版本：")}{devVersion}
                        </Typography>
                    </Box>
                </Box>
                <Link href="https://github.com/neila-a/verkfi/releases">
                    <Button startIcon={<GitHub />}>
                        {get("infos.viewChangelog")}
                    </Button>
                </Link>
            </Box>
            <Typography variant="body1" sx={{
                p: 2,
                mb: 4
            }} paragraph>
                ©Copyleft ! <time dateTime="2022">2022</time>-<time dateTime={year.toString()}>
                    {year}
                </time>， <Link href={new URL(author.url)}>
                    {author.name}
                </Link>
                <br />
                {get("copyright.本程序从未提供品质担保。")}
                <br />
                {getHTML("copyright.版权")}
            </Typography>
            <Suspense fallback={<Loading />}>
                <Reset />
            </Suspense>
            <Typography variant="body1" sx={{
                mt: 4,
                p: 2
            }}>
                {get("infos.status.完整路径名")}：{addressInfo.href}
                <br />
                {get("infos.status.域名")}：{addressInfo.host}
                <br />
                {get("infos.status.路径")}：{addressInfo.pathname}
                <br />
                {get("infos.status.协议")}：{addressInfo.protocol}
                <br />
                {get("infos.status.端口")}：{addressInfo.port}
            </Typography>
        </>
    );
}
