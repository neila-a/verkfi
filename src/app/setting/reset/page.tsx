"use client";
import I18N from 'react-intl-universal';
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
</Stack >;
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
            <Typography variant='h4'>
                {I18N.get('重置')}
            </Typography>
            <Stack direction={direction} spacing={{
                xs: 10,
                sm: 15,
                md: 20
            }} divider={<Divider orientation="vertical" flexItem />}>
                <Spacing3Stack>
                    <Line
                        value={Number((cacheUsed / cacheAll * 100).toFixed(5))}
                        mainLabel={I18N.get("缓存空间")}
                        usedLabel={`${I18N.get("已用")} ${cacheUsed.toFixed(5)} MB`}
                        surLabel={`${I18N.get("总容量")} ${cacheAll.toFixed(5)} MB`}
                    />
                    <Button variant="contained" onClick={event => {
                        setDialogOpen(true);
                        setDialogContext(I18N.get("清空缓存吗？此操作不可恢复。"));
                        setDialogTitle(I18N.get("清空"));
                        setDialogOnDone(() => () => caches.keys().then(keylist => Promise.all(keylist.map(key => {
                            logger.log(`已删除缓存“${key}”`);
                            return caches.delete(key);
                        }))));
                    }}>{I18N.get('清空所有缓存')}</Button>
                </Spacing3Stack>
                <Spacing3Stack>
                    <Line
                        value={Number((cacheUsed / cacheAll * 100).toFixed(5))}
                        mainLabel={I18N.get("设置空间")}
                        usedLabel={`${I18N.get("已用")} ${getSettingsUsed()} KB`}
                        surLabel={`${I18N.get("总容量")} ${getSettingsSur()} KB`}
                    />
                    <Button variant="contained" onClick={event => {
                        setDialogOpen(true);
                        setDialogContext(I18N.get("清空设置吗？此操作不可恢复。"));
                        setDialogTitle(I18N.get("清空"));
                        setDialogOnDone(() => () => localStorage.clear());
                    }}>{I18N.get('清空所有设置')}</Button>
                    {dialogOpen && <CheckDialog title={dialogTitle} onFalse={() => {
                        setDialogOpen(false);
                    }} onTrue={() => {
                        dialogOnDone();
                        setDialogOpen(false);
                    }} description={dialogContext} />}
                </Spacing3Stack>
            </Stack>
        </ErrorBoundary>
    );
}
