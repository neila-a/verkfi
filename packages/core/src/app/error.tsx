"use client";
import {
    Button,
    ButtonGroup,
    Typography
} from "@mui/material";
import db from "@verkfi/shared/reader/db";
import {
    logger
} from "layout/layoutClient"; // 都是全局日志
import Loading from "loading";
import {
    useEffect
} from "react";
import {
    get
} from "react-intl-universal";
export default function Error(props: {
    error: Error & {
        digest?: string;
    };
    reset: () => void;
}) {
    useEffect(() => {
        logger.error(props.error);
    }, [props.error]); // 官方教程里的
    return (
        <Loading>
            <Typography sx={{
                textAlign: "center"
            }}>
                {get("发生了一些错误")}
                <br />
                {String(props.error)}
            </Typography>
            <ButtonGroup>
                <Button variant="contained" onClick={event => props.reset()}>
                    {get("重试")}
                </Button>
                <Button variant="outlined" onClick={async event => {
                    const keylist = await caches.keys();
                    keylist.map(async key => {
                        logger.log(`已删除缓存“${key}”`);
                        return await caches.delete(key);
                    });
                    props.reset();
                }}>
                    {get("error.cache")}
                </Button>
                <Button variant="outlined" onClick={async event => {
                    await db.options.clear();
                    props.reset();
                }}>
                    {get("error.setting")}
                </Button>
            </ButtonGroup>
        </Loading>
    );
}
