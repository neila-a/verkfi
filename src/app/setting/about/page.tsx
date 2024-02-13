"use client";
import {
    get,
    getHTML
} from 'react-intl-universal';
import {
    Box,
    Grid,
    Stack,
    SvgIconTypeMap,
    Typography
} from "@mui/material";
import {
    Info as InfoIcon,
    Copyright as CopyrightIcon,
    Storage as StorageIcon,
    Article as ArticleIcon
} from "@mui/icons-material";
import pack from "../../../../package.json";
import ErrorBoundary from '../../components/ErrorBoundary';
import {
    OverridableComponent
} from '@mui/material/OverridableComponent';
import {
    ReactNode,
    useState,
    useEffect
} from 'react';
import getCache from '../getCache';
import getSettingsSur from '../getSettingsSur';
import getSettingsUsed from '../getSettingsUsed';
import dynamic from 'next/dynamic';
import VerkfiIcon from '../../components/verkfiIcon/verkfiIcon';
const PureDialog = dynamic(() => import("../../components/dialog/PureDialog"));
interface singleAbout {
    icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
        muiName: string
    };
    name: ReactNode;
    context: ReactNode;
}
interface abouts {
    [key: string]: singleAbout;
}
const {
    version, devVersion
} = pack;
export default function About() {
    const initialAddressInfo = {
        host: "",
        href: "",
        pathname: "",
        port: "",
        protocol: ""
    };
    const [cacheUsed, setCacheUsed] = useState<number>(1),
        [cacheAll, setCacheAll] = useState<number>(2),
        [load, setLoad] = useState<boolean>(false),
        [dialogOpen, setDialogOpen] = useState<boolean>(false),
        [dialogContext, setDialogContext] = useState<ReactNode>(""),
        [dialogTitle, setDialogTitle] = useState<string>(""),
        year = new Date().getFullYear(),
        [addressInfo, setAddressInfo] = useState<typeof initialAddressInfo>(initialAddressInfo);
    const abouts = {
        law: {
            icon: CopyrightIcon,
            name: get("infos.法律信息"),
            context: <Typography component="p">
                ©Copyleft ! <time dateTime="2022">2022</time>-<time dateTime={year.toString()}>{year}</time>， Neila
                <br />
                {get('copyright.本程序从未提供品质担保。')}
                <br />
                {getHTML('copyright.版权')}
            </Typography>
        },
        version: {
            icon: InfoIcon,
            name: get("infos.版本信息"),
            context: <Typography>
                {get('发行版本：')}{version}
                <br />
                {get('内部版本：')}{devVersion}
            </Typography>
        },
        storage: {
            icon: StorageIcon,
            name: get("infos.存储信息"),
            context: <Stack spacing={2}>
                <Typography>
                    {get("storage.缓存空间已使用容量")}：{cacheUsed.toFixed(5)}MB
                    <br />
                    {get("storage.缓存空间剩余容量")}：{(cacheAll - cacheUsed).toFixed(5)}MB
                </Typography>
                <Typography>
                    {get("storage.设置空间已使用容量")}：{getSettingsUsed()}KB
                    <br />
                    {get("storage.设置空间剩余容量")}：{getSettingsSur()}KB
                </Typography>
            </Stack>
        },
        statusInfo: {
            icon: ArticleIcon,
            name: get("infos.状态信息"),
            context: <Typography>
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
        }
    } satisfies abouts;
    useEffect(() => {
        let mounted = true;
        if (mounted) {
            getCache("usage").then(value => setCacheUsed(value));
            getCache("quota").then(value => setCacheAll(value));
            setLoad(true);
            setAddressInfo({
                href: location.href,
                host: location.hostname,
                pathname: location.pathname,
                protocol: location.protocol,
                port: location.port
            });
        }
        return () => {
            mounted = false;
        };
    }, []);
    return load && (
        <ErrorBoundary>
            <Typography variant='h4'>
                {get('关于')}
            </Typography>
            <Box sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <VerkfiIcon sx={{
                    fontSize: "2.125rem"
                }} />
                <Typography variant="h4" sx={{
                    fontWeight: 300
                }}>Verkfi</Typography>
            </Box>
            <Grid container spacing={{
                xs: 2,
                md: 3
            }} columns={{
                xs: 4,
                sm: 8,
                md: 12
            }}>
                {Object.values(abouts).map((item, index) => (
                    <Grid item xs={2} sm={4} md={4} key={Object.keys(abouts).filter(single => abouts[single] === item)[0]}>
                        <Box sx={{
                            cursor: "pointer"
                        }} onClick={event => {
                            setDialogContext(item.context);
                            setDialogTitle(item.name);
                            setDialogOpen(true);
                        }}>
                            <Typography>
                                <item.icon />
                                <br />
                                {item.name}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>
            <PureDialog open={dialogOpen} title={dialogTitle} onClose={() => {
                setDialogContext("");
                setDialogTitle("");
                setDialogOpen(false);
            }}>
                <Box component="section">
                    {dialogContext}
                </Box>
            </PureDialog>
        </ErrorBoundary>
    );
}
