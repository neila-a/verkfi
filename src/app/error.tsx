"use client";
import {
    Button,
    Typography
} from "@mui/material";
import Layout from "./layout";
import Loading from "./loading";
import I18N from "react-intl-universal";
export default function GlobalError({
    error,
    reset,
}: {
    error: Error
    reset: () => void
}) {
    return (
        <Layout>
            <Loading>
                <Typography sx={{
                    textAlign: "center"
                }}>
                    {I18N.get("发生了一些错误")}
                    <br />
                    {String(error)}
                </Typography>
                <br />
                <Button variant="contained" onClick={event => {
                    reset();
                }}>
                    {I18N.get("重试")}
                </Button>
            </Loading>
        </Layout>
    );
}