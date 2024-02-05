'use client'
import Error from "./error";
export default function GlobalError(props: {
    error: Error & {
        digest?: string;
    }
    reset: () => void
}) {
    return (
        <html lang="zh-cmn-Hans-CN">
            <body>
                <Error error={props.error} reset={props.reset} />
            </body>
        </html>
    );
}