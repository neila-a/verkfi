import { I18N } from '@common/I18N';
import {
    Button
} from "@mui/material";
import {
    useState,
    useEffect
} from "react";
import {
    VictoryPie
} from "victory";
import CheckDialog from "../dialog/CheckDialog";
import {
    MB
} from "./consts";
import getSettingsSur from "./getSettingsSur";
import getSettingsUsed from "./getSettingsUsed";
import {
    logger
} from "../../pages/settings";
export default function Reset() {
    var [dialogOpen, setDialogOpen] = useState<boolean>(false),
        [dialogContext, setDialogContext] = useState<string>(""),
        [dialogTitle, setDialogTitle] = useState<string>(""),
        [cacheUsed, setCacheUsed] = useState<number>(1),
        [cacheAll, setCacheAll] = useState<number>(2),
        [dialogOnDone, setDialogOnDone] = useState<() => any>(() => null);
    useEffect(() => {
        navigator.storage.estimate().then(estimate => {
            setCacheUsed(estimate.usage / MB);
            setCacheAll(estimate.quota / MB);
        })
    }, [])
    return (
        <>
            <VictoryPie height={256} width={256} colorScale={[
                "tomato",
                "orange"
            ]} animate={{
                duration: 2000
            }} data={[
                {
                    x: `缓存空间已使用容量：${cacheUsed.toFixed(5)}MB`,
                    y: Number((cacheUsed / cacheAll * 100).toFixed(5))
                },
                {
                    x: `缓存空间剩余容量：${(cacheAll - cacheUsed).toFixed(5)}MB`,
                    y: Number(((cacheAll - cacheUsed) / cacheAll * 100).toFixed(5))
                }
            ]} />
            <Button variant="contained" onClick={event => {
                setDialogOpen(true);
                setDialogContext("确定清空所有缓存吗？此操作不可恢复。");
                setDialogTitle("清空");
                setDialogOnDone(() => () => caches.keys().then(keylist => Promise.all(keylist.map(key => {
                    logger.log(`已删除缓存“${key}”`);
                    return caches.delete(key);
                }))));
            }}>{I18N.get('清空所有缓存')}</Button>
            <VictoryPie height={256} width={256} colorScale={[
                "tomato",
                "orange"
            ]} animate={{
                duration: 2000
            }} data={[
                {
                    x: `设置空间已使用容量：${getSettingsUsed()}KB`,
                    y: getSettingsUsed() / 5120 * 100
                },
                {
                    x: `设置空间剩余容量：${getSettingsSur()}KB`,
                    y: getSettingsSur() / 5120 * 100
                }
            ]} />
            <Button variant="contained" onClick={event => {
                setDialogOpen(true);
                setDialogContext("确定清空所有设置吗？此操作不可恢复。");
                setDialogTitle("清空");
                setDialogOnDone(() => () => localStorage.clear());
            }}>{I18N.get('清空所有设置')}</Button>
            {dialogOpen && <CheckDialog title={dialogTitle} onFalse={() => {
                setDialogOpen(false);
            }} onTrue={() => {
                dialogOnDone();
                setDialogOpen(false);
            }} description={dialogContext} />}
        </>
    );
}