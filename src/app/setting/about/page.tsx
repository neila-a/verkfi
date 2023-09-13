"use client";
import I18N from 'react-intl-universal';
import {
    Grid,
    SvgIconTypeMap,
    Typography
} from "@mui/material";
import {
    Handyman as HandyManIcon,
    Info as InfoIcon,
    Copyright as CopyrightIcon,
    Storage as StorageIcon,
    Article as ArticleIcon
} from "@mui/icons-material";
import style from "./About.module.scss";
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
    var [cacheUsed, setCacheUsed] = useState<number>(1),
        [cacheAll, setCacheAll] = useState<number>(2),
        [load, setLoad] = useState<boolean>(false),
        [dialogOpen, setDialogOpen] = useState<boolean>(false),
        [dialogContext, setDialogContext] = useState<ReactNode>(""),
        [dialogTitle, setDialogTitle] = useState<string>(""),
        [addressInfo, setAddressInfo] = useState<typeof initialAddressInfo>(initialAddressInfo);
    const abouts = {
        law: {
            icon: CopyrightIcon,
            name: I18N.get("法律信息"),
            context: <Typography>
                ©Copyleft ! 2022-2023， Neila.
                <br />
                {I18N.get('本程序从未提供品质担保。')}
                <br />
                {I18N.getHTML('版权')}
            </Typography>
        },
        version: {
            icon: InfoIcon,
            name: I18N.get("版本信息"),
            context: <Typography>
                {I18N.get('发行版本：')}{version}
                <br />
                {I18N.get('内部版本：')}{devVersion}
            </Typography>
        },
        storage: {
            icon: StorageIcon,
            name: I18N.get("存储信息"),
            context: <Typography>
                {I18N.get("缓存空间已使用容量")}：{cacheUsed.toFixed(5)}MB
                <br />
                {I18N.get("缓存空间剩余容量")}：{(cacheAll - cacheUsed).toFixed(5)}MB
                <br />
                <br />
                {I18N.get("设置空间已使用容量")}：{getSettingsUsed()}KB
                <br />
                {I18N.get("设置空间剩余容量")}：{getSettingsSur()}KB
            </Typography>
        },
        statusInfo: {
            icon: ArticleIcon,
            name: I18N.get("状态信息"),
            context: <Typography>
                {I18N.get("完整路径名")}：{addressInfo.href}
                <br />
                {I18N.get("域名")}：{addressInfo.host}
                <br />
                {I18N.get("路径")}：{addressInfo.pathname}
                <br />
                {I18N.get("协议")}：{addressInfo.protocol}
                <br />
                {I18N.get("端口")}：{addressInfo.port}
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
                {I18N.get('关于')}
            </Typography>
            <div className={style["title"]}>
                <HandyManIcon sx={{
                    fontSize: "2.125rem"
                }} />
                <Typography variant="h4" sx={{
                    fontWeight: 300
                }}>NeilaTools</Typography>
            </div>
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                {Object.values(abouts).map((item, index) => (
                    <Grid item xs={2} sm={4} md={4} key={Object.keys(abouts).filter(single => abouts[single] === item)[0]}>
                        <div style={{
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
                        </div>
                    </Grid>
                ))}
            </Grid>
            {dialogOpen && <PureDialog title={dialogTitle} onClose={() => {
                setDialogContext("");
                setDialogTitle("");
                setDialogOpen(false);
            }}>
                {dialogContext}
            </PureDialog>}
        </ErrorBoundary>
    );
}
