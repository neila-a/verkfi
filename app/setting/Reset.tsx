import I18N from 'react-intl-universal';
import {
    Button,
    Stack
} from "@mui/material";
import {
    useState,
    useEffect
} from "react";
import {
    VictoryPie
} from "victory";
import CheckDialog from "../components/dialog/CheckDialog";
import getSettingsSur from "./getSettingsSur";
import getSettingsUsed from "./getSettingsUsed";
import {
    logger
} from "./consts";
import ErrorBoundary from '../components/ErrorBoundary';
import getCache from './getCache';
export default function Reset() {
    var [dialogOpen, setDialogOpen] = useState<boolean>(false),
        [dialogContext, setDialogContext] = useState<string>(""),
        [dialogTitle, setDialogTitle] = useState<string>(""),
        [cacheUsed, setCacheUsed] = useState<number>(1),
        [cacheAll, setCacheAll] = useState<number>(2),
        [load, setLoad] = useState<boolean>(false),
        [dialogOnDone, setDialogOnDone] = useState<() => any>(() => null);
    useEffect(() => {
        getCache("usage").then(value => setCacheUsed(value));
        getCache("quota").then(value => setCacheAll(value));
        setLoad(true);
    }, []);
    return load && (
        <ErrorBoundary>
            <Stack
                direction={{
                    xs: 'column',
                    sm: 'row'
                }}
                spacing={{
                    xs: 1,
                    sm: 2,
                    md: 4
                }}
            >
                <Stack direction="column">
                    <VictoryPie colorScale={[
                        "tomato",
                        "orange"
                    ]} animate={{
                        duration: 2000
                    }} data={[
                        {
                            x: `${I18N.get("缓存空间已使用容量")}：${cacheUsed.toFixed(5)}MB`,
                            y: Number((cacheUsed / cacheAll * 100).toFixed(5))
                        },
                        {
                            x: `${I18N.get("缓存空间剩余容量")}：${(cacheAll - cacheUsed).toFixed(5)}MB`,
                            y: Number(((cacheAll - cacheUsed) / cacheAll * 100).toFixed(5))
                        }
                    ]} />
                    <Button variant="contained" onClick={event => {
                        setDialogOpen(true);
                        setDialogContext(I18N.get("确定清空所有缓存吗？此操作不可恢复。"));
                        setDialogTitle(I18N.get("清空"));
                        setDialogOnDone(() => () => caches.keys().then(keylist => Promise.all(keylist.map(key => {
                            logger.log(`已删除缓存“${key}”`);
                            return caches.delete(key);
                        }))));
                    }}>{I18N.get('清空所有缓存')}</Button>
                </Stack>
                <Stack direction="column">
                    <VictoryPie colorScale={[
                        "tomato",
                        "orange"
                    ]} animate={{
                        duration: 2000
                    }} data={[
                        {
                            x: `${I18N.get("设置空间已使用容量")}：${getSettingsUsed()}KB`,
                            y: getSettingsUsed() / 5120 * 100
                        },
                        {
                            x: `${I18N.get("设置空间剩余容量")}：${getSettingsSur()}KB`,
                            y: getSettingsSur() / 5120 * 100
                        }
                    ]} />
                    <Button variant="contained" onClick={event => {
                        setDialogOpen(true);
                        setDialogContext(I18N.get("确定清空所有设置吗？此操作不可恢复。"));
                        setDialogTitle(I18N.get("清空"));
                        setDialogOnDone(() => () => localStorage.clear());
                    }}>{I18N.get('清空所有设置')}</Button>
                    {dialogOpen && <CheckDialog title={dialogTitle} onFalse={() => {
                        setDialogOpen(false);
                    }} onTrue={() => {
                        dialogOnDone();
                        setDialogOpen(false);
                    }} description={dialogContext} />}
                </Stack>
            </Stack>
        </ErrorBoundary>
    );
}
