import {
    Handyman as HandymanIcon
} from "@mui/icons-material";
import {
    Box,
    LinearProgress
} from "@mui/material";
export default function Loading() {
    return (
        <Box sx={{
            display: "flex",
            flexWrap: "wrap",
            alignContent: "center",
            width: "100vw",
            height: "100vh",
            flexDirection: "column",
            backgroundColor: "#1976d2",
            justifyContent: "space-evenly"
        }}>
            <HandymanIcon sx={{
                fontSize: "1000%"
            }} />
            <LinearProgress color="secondary" />
        </Box>
    );
}