import {
    Box,
    LinearProgress
} from "@mui/material";
import {
    ReactNode
} from "react";
import favicon from "image/favicon.svg";
export default function Loading(props: {
    children?: ReactNode;
    hideProgress?: boolean;
}) {
    return (
        <Box sx={{
            display: "flex",
            flexWrap: "wrap",
            alignContent: "center",
            width: "100%",
            height: "100vh",
            flexDirection: "column",
            backgroundColor: "unset",
            justifyContent: "space-evenly",
            alignItems: "center"
        }}>
            <img src={favicon} width={160} height={160} alt="VerkfiIcon" />
            {props?.children}
            {!props?.hideProgress && <LinearProgress color="secondary" sx={{
                width: 160
            }} />}
        </Box>
    );
}
