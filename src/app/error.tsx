"use client";
import {
    Button,
    Typography
} from "@mui/material";
import Loading from "./loading";
import {
    get
} from "react-intl-universal";
export default function GlobalError(props: {
    error: Error;
    reset: () => void;
}) {
    return (
        <Loading>
            <Typography sx={{
                textAlign: "center"
            }}>
                {get("发生了一些错误")}
                <br />
                {String(props.error)}
            </Typography>
            <br />
            <Button variant="contained" onClick={event => {
                props.reset();
            }}>
                {get("重试")}
            </Button>
        </Loading>
    );
}