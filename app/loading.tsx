import {
    Box,
    CircularProgress
} from "@mui/material";
export default function Loading() {
    return (
        <Box sx={{
            display: "flex",
            justifyContent: "center",
            width: "100vw",
            height: "100vh",
            backgroundColor: "#1976d2"
        }}>
            <CircularProgress color="success" />
        </Box>
    );
}