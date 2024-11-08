"use client";
import {
    Box,
    Grid,
    Typography
} from "@mui/material";
import {
    PaletteColor,
    useTheme,
    Theme,
    rgbToHex
} from "@mui/material/styles";
const schemes = ["dark", "main", "light"] as Array<keyof PaletteColor>,
    ColorBar = ({
        color
    }) => {
        const theme = useTheme();
        return <Grid container sx={{
            mt: 2
        }}>
            {schemes.map(key => {
                const background = (theme: Theme) => theme.palette.augmentColor({
                    color: {
                        main: color
                    }
                })[key];
                return <Box sx={{
                    width: 64,
                    height: 64,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: background
                }} key={key}>
                    <Typography
                        variant="caption"
                        sx={theme => ({
                            color: theme.palette.getContrastText(background(theme))
                        })}
                    >
                        {rgbToHex(background(theme))}
                    </Typography>
                </Box>;
            })}
        </Grid>;
    };
export default ColorBar;
