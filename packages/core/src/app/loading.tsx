import {
    Box,
    LinearProgress
} from "@mui/material";
import {
    ReactNode
} from "react";
import Image from "next/image";
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
            backgroundColor: "#1976d2",
            justifyContent: "space-evenly",
            alignItems: "center"
        }}>
            <Image src="/image/favicon.svg" width={160} height={160} alt="VerkfiIcon" />
            {isLoading ? (
                <LinearProgress color="secondary" sx={{
                    width: 160
                }} />
            ) : props.children}
        </Box>
    );
}