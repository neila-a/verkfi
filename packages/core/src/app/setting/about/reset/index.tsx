"use client";
import {
    Button
} from "@mui/material";
import ErrorBoundary from "@verkfi/shared/ErrorBoundary";
import dynamic from "next/dynamic";
import {
    use,
    useState
} from "react";
import {
    get
} from "react-intl-universal";
import {
    logger
} from "../../logger";
import Line from "./Line";
import getCache from "./getCache";
const CheckDialog = dynamic(() => import("@verkfi/shared/dialog/Check")),
    fractionDigits = 5;
export default function Reset() {
    const [dialogOpen, setDialogOpen] = useState<boolean>(false),
        cacheUsed = use(getCache("usage")),
        cacheAll = use(getCache("quota"));
    return (
        <ErrorBoundary>
            <Line
                // 100用于把小数转换为百分比
                // eslint-disable-next-line no-magic-numbers
                value={Number((cacheUsed / cacheAll * 100).toFixed(fractionDigits))}
                mainLabel={get("storage.缓存空间")}
                usedLabel={`${get("已用")} ${cacheUsed.toFixed(fractionDigits)} MB`}
                surLabel={`${get("storage.总容量")} ${cacheAll.toFixed(fractionDigits)} MB`}
            />
            <Button variant="contained" onClick={() => {
                setDialogOpen(true);
            }} fullWidth>
                {get("clear.清空所有缓存")}
            </Button>
            <CheckDialog open={dialogOpen} title={get("clear.清空")} onFalse={() => {
                setDialogOpen(false);
            }} onTrue={async () => {
                const keylist = await caches.keys();
                keylist.map(async key => {
                    logger.log(`已删除缓存“${key}”`);
                    return await caches.delete(key);
                });
                setDialogOpen(false);
            }} description={get("clear.清空缓存吗？此操作不可恢复。")} />
        </ErrorBoundary>
    );
}
