"use client";
import {
    Box,
    Grid,
    Typography
} from "@mui/material";
import {
    rgbToHex,
    useTheme
} from "@mui/material/styles";
const ColorBar = ({
    color
}) => {
    const theme = useTheme(),
        background = theme.palette.augmentColor({
            color: {
                main: color
            }
        });
    return (
        <Grid container sx={{
            mt: 2
        }}>
            {["dark", "main", "light"].map(key => <Box
                sx={{
                    width: 64,
                    height: 64,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: background[key]
                }}
                key={key}
            >
                <Typography
                    variant="caption"
                    sx={{
                        color: theme.palette.getContrastText(background[key])
                    }}
                >
                    {rgbToHex(background[key])}
                </Typography>
            </Box>
            )}
        </Grid>
    );
};
export default ColorBar;
