"use client";
import {
    Box,
    LinearProgress,
    Typography
} from "@mui/material";
import {
    get
} from "react-intl-universal";
import {
    ErrorBoundary
} from "react-error-boundary";
import {
    useRouteLoaderData
} from "react-router";
import Error from "error";
const fractionDigits = 5;
export default function Line() {
    const data = useRouteLoaderData("settingsAbout"),
        cacheUsed = data[0],
        cacheAll = data[1];
    return (
        <ErrorBoundary FallbackComponent={Error}>
            <Box sx={{
                width: "100%",
                mr: 1
            }}>
                <LinearProgress
                    variant="determinate"
                    // 100用于把小数转换为百分比
                    // eslint-disable-next-line no-magic-numbers
                    value={+(cacheUsed / cacheAll * 100).toFixed(fractionDigits)}
                />
            </Box>
            <Box sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
            }}>
                <Box sx={{
                    minWidth: 35
                }}>
                    <Typography variant="body2" color="text.secondary">
                        {`${get("已用")} ${cacheUsed.toFixed(fractionDigits)} MB`}
                    </Typography>
                </Box>
                <Box sx={{
                    minWidth: 35
                }}>
                    <Typography variant="body2" color="text.secondary">
                        {`${get("storage.总容量")} ${cacheAll.toFixed(fractionDigits)} MB`}
                    </Typography>
                </Box>
            </Box>
        </ErrorBoundary>
    );
}
