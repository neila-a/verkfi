"use client";
import {
    Button,
    ButtonGroup,
    Typography
} from "@mui/material";
import {
    logger
} from "layout/layoutClient"; // 都是全局日志
import Loading from "loading";
import {
    get
} from "react-intl-universal";
import {
    useRouteError
} from "react-router";
export default function Error() {
    const error = useRouteError() as any;
    console.log(error);
    return (
        <Loading hideProgress>
            <Typography sx={{
                textAlign: "center"
            }}>
                {get("发生了一些错误")}
                <br />
                {error?.statusText}
                <br />
                {error?.data}
            </Typography>
            <ButtonGroup>
                <Button variant="contained" onClick={location.reload}>
                    {get("重试")}
                </Button>
                <Button variant="outlined" onClick={async event => {
                    const keylist = await caches.keys();
                    keylist.forEach(async key => {
                        logger.log(`已删除缓存“${key}”`);
                        return await caches.delete(key);
                    });
                    location.reload();
                }}>
                    {get("error.cache")}
                </Button>
                <Button variant="outlined" onClick={async event => {
                    localStorage.clear();
                    location.reload();
                }}>
                    {get("error.setting")}
                </Button>
            </ButtonGroup>
        </Loading>
    );
}
