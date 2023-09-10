"use client";
import {
    Button,
    Typography
} from "@mui/material";
import Loading from "./loading";
import I18N from "react-intl-universal";
export default function GlobalError(props: {
    error: Error;
    reset: () => void;
}) {
    return (
        <Loading>
            <Typography sx={{
                textAlign: "center"
            }}>
                {I18N.get("发生了一些错误")}
                <br />
                {String(props.error)}
            </Typography>
            <br />
            <Button variant="contained" onClick={event => {
                props.reset();
            }}>
                {I18N.get("重试")}
            </Button>
        </Loading>
    );
}