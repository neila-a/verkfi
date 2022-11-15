import * as React from "react";
import Head from "next/head";
import {
    Typography,
    TextField,
    Alert
} from "@mui/material";
import {} from "@mui/icons-material";
function Index(): JSX.Element {
    return (<>
        <Head>
            <link rel="shortcut icon" href="/favicon.ico" />
            <title>翻转</title>
        </Head>
        <Alert severity="info">以空格分隔。</Alert>
        <TextField fullWidth label="输入框" id="input" />
    </>);
};
export default Index;