import {
    Handyman as HandymanIcon
} from "@mui/icons-material";
import {
    Box,
    LinearProgress
} from "@mui/material";
import {
    ReactNode
} from "react";
export default function Loading(props: {
    children?: ReactNode;
}) {
    var isLoading = props.children === undefined;
    return (
        <Box sx={{
            display: "flex",
            flexWrap: "wrap",
            alignContent: "center",
            width: "100vw",
            height: "100vh",
            flexDirection: "column",
            backgroundColor: "#1976d2",
            justifyContent: "space-evenly",
            alignItems: "center"
        }}>
            <HandymanIcon sx={{
                fontSize: "1000%"
            }} />
            {isLoading ? <LinearProgress color="secondary" sx={{
                width: 160
            }} /> : props.children}
        </Box>
    );
}