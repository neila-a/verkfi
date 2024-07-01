import {
    Box,
    LinearProgress
} from "@mui/material";
import Image from "next/image";
import {
    ReactNode
} from "react";
import favicon from "./image/favicon.svg";
export default function Loading(props: {
    children?: ReactNode;
}) {
    const isLoading = props.children === undefined;
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
            <Image priority={false} src={favicon} width={160} height={160} alt="VerkfiIcon" />
            {isLoading ? <LinearProgress color="secondary" sx={{
                width: 160
            }} /> : props.children}
        </Box>
    );
}
