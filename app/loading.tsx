import {
    Handyman as HandymanIcon
} from "@mui/icons-material";
import {
    Box,
    LinearProgress
} from "@mui/material";
import { ReactNode } from "react";
export default function Loading(props: {
    children?: ReactNode;
}) {
    var Progress = props.children;
    if (Progress === undefined) {
        Progress = <LinearProgress color="secondary" />;
    }
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
            {Progress}
        </Box>
    );
}