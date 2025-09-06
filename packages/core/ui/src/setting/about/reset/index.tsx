"use client";
import {
    Button,
    Skeleton,
    Stack,
    Typography
} from "@mui/material";
import {
    ErrorBoundary
} from "react-error-boundary";
import {
    Suspense,
    useState
} from "react";
import {
    get
} from "react-intl-universal";
import {
    logger
} from "../../logger";
import Line from "./Line";
import CheckDialog from "@verkfi/shared/dialog/Check";
import Error from "error";
export default function Reset() {
    const [dialogOpen, setDialogOpen] = useState(false);
    return (
        <ErrorBoundary FallbackComponent={Error}>
            <Stack direction="column" spacing={1}>
                <Typography>
                    {get("storage.缓存空间")}
                </Typography>
                <Suspense fallback={<Skeleton />}>
                    <Line />
                </Suspense>
            </Stack>
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
