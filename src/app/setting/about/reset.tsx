"use client";
import {
    get
} from 'react-intl-universal';
import {
    Button,
    Divider,
    Stack,
    Typography
} from "@mui/material";
import {
    useState,
    useEffect,
    FC,
    ReactNode
} from "react";
import dynamic from 'next/dynamic';
const CheckDialog = dynamic(() => import("../../components/dialog/CheckDialog"));
import getSettingsSur from "../getSettingsSur";
import getSettingsUsed from "../getSettingsUsed";
import {
    logger
} from "../consts";
import ErrorBoundary from '../../components/ErrorBoundary';
import getCache from '../getCache';
import Line from './Line';
import {
    ResponsiveStyleValue
} from '@mui/system';
const direction: ResponsiveStyleValue<'row' | 'row-reverse' | 'column' | 'column-reverse'> = {
    xs: "column",
    sm: "row",
    md: "row"
};
const Spacing3Stack: FC<{
    children: ReactNode
}> = props => <Stack spacing={3}>
    {props.children}
</Stack>;
export default function Reset() {
    const [dialogOpen, setDialogOpen] = useState<boolean>(false),
        [dialogContext, setDialogContext] = useState<string>(""),
        [dialogTitle, setDialogTitle] = useState<string>(""),
        [cacheUsed, setCacheUsed] = useState<number>(1),
        [cacheAll, setCacheAll] = useState<number>(2),
        [load, setLoad] = useState<boolean>(false),
        [dialogOnDone, setDialogOnDone] = useState<() => any>(() => null);
    useEffect(() => {
        (async () => {
            const usageValue = await getCache("usage")
            setCacheUsed(usageValue);
            const quotaValue = await getCache("quota");
            setCacheAll(quotaValue);
        })();
        setLoad(true);
    }, []);
    return load && (
        <ErrorBoundary>
            <Stack direction={direction} spacing={{
                xs: 2,
                sm: 3,
                md: 4
            }} divider={<Divider orientation="vertical" flexItem />}>
                <Spacing3Stack>
                    <Line
                        value={Number((cacheUsed / cacheAll * 100).toFixed(5))}
                        mainLabel={get("storage.缓存空间")}
                        usedLabel={`${get("已用")} ${cacheUsed.toFixed(5)} MB`}
                        surLabel={`${get("storage.总容量")} ${cacheAll.toFixed(5)} MB`}
                    />
                    <Button variant="contained" onClick={event => {
                        setDialogOpen(true);
                        setDialogContext(get("clear.清空缓存吗？此操作不可恢复。"));
                        setDialogTitle(get("clear.清空"));
                        setDialogOnDone(() => async () => {
                            const keylist = await caches.keys();
                            keylist.map(async key => {
                                logger.log(`已删除缓存“${key}”`);
                                return await caches.delete(key);
                            });
                        });
                    }}>{get('clear.清空所有缓存')}</Button>
                </Spacing3Stack>
                <Spacing3Stack>
                    <Line
                        value={Number((cacheUsed / cacheAll * 100).toFixed(5))}
                        mainLabel={get("storage.设置空间")}
                        usedLabel={`${get("已用")} ${getSettingsUsed()} KB`}
                        surLabel={`${get("storage.总容量")} ${getSettingsSur()} KB`}
                    />
                    <Button variant="contained" onClick={event => {
                        setDialogOpen(true);
                        setDialogContext(get("clear.清空设置吗？此操作不可恢复。"));
                        setDialogTitle(get("clear.清空"));
                        setDialogOnDone(() => () => localStorage.clear());
                    }}>{get('clear.清空所有设置')}</Button>
                    <CheckDialog open={dialogOpen} title={dialogTitle} onFalse={() => {
                        setDialogOpen(false);
                    }} onTrue={() => {
                        dialogOnDone();
                        setDialogOpen(false);
                    }} description={dialogContext} />
                </Spacing3Stack>
            </Stack>
        </ErrorBoundary>
    );
}
