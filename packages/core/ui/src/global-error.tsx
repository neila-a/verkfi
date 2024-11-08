"use client";
import {
    Button,
    Typography
} from "@mui/material";
import Loading from "loading";
export default function GlobalError({
    error,
    reset
}: {
    error: Error & {
        digest?: string;
    };
    reset: () => void;
}) {
    return (
        <html lang="zh-cmn-Hans-CN">
            <body>
                <Loading>
                    <Typography sx={{
                        textAlign: "center"
                    }}>
                        Something wrongs:
                        <br />
                        {String(error)}
                    </Typography>
                    <Button onClick={reset}>
                        Retry
                    </Button>
                </Loading>
            </body>
        </html>
    );
}
