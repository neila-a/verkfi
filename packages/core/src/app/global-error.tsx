'use client';
import Error from "error";
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
                <Error error={error} reset={reset} />
            </body>
        </html>
    );
}