"use client";
import {
    BrightnessMedium,
    DarkMode,
    LightMode
} from "@mui/icons-material";
import {
    Box,
    Button,
    Grid,
    InputLabel,
    PaletteMode,
    Paper,
    useColorScheme
} from "@mui/material";
import {
    useAtom
} from "jotai";
import {
    gradientTool
} from "@verkfi/shared/atoms";
import {
    get
} from "react-intl-universal";
import {
    Switcher
} from "setting/option/Switcher";
import defaultInternalPalette from "./defaultInternalPalette";
import internalPaletteAtom from "./paletteAtom";
import ColorPicker from "./ColorPicker";
function ColorTool() {
    const [internalPalette, setInternalPalette] = useAtom(internalPaletteAtom),
        {
            mode,
            setMode
        } = useColorScheme();
    return (
        <>
            <Switcher option={[gradientTool, "渐变工具"]} key="gradientTool" />
            <Box>
                <InputLabel>
                    {get("appearance.colorMode.text")}
                </InputLabel>
                <Grid container direction="row" spacing={1} sx={{
                    justifyContent: "space-evenly",
                    mb: 2
                }}>
                    {([["light", LightMode], ["dark", DarkMode], ["system", BrightnessMedium]] satisfies [PaletteMode | "system", typeof LightMode][]).map(item => {
                        const isThis = mode === item[0],
                            Icon = item[1];
                        return (
                            <Grid item key={item[0]}>
                                <Paper onClick={event => {
                                    setMode(item[0]);
                                }} sx={{
                                    p: 2,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    boxShadow: theme => isThis && `inset 0 0 0 ${theme.spacing(1)} ${theme.palette.primary[theme.palette.mode]}`,
                                    borderColor: theme => isThis && theme.palette.primary[theme.palette.mode]
                                }}>
                                    <Icon sx={{
                                        fontSize: "10vw",
                                        color: theme => theme.palette.primary.main
                                    }} />
                                    {get(`appearance.colorMode.${item[0]}`)}
                                </Paper>
                            </Grid>
                        );
                    })}
                </Grid>
            </Box>
            <Grid container spacing={5} sx={{
                p: 0,
                mb: 2
            }}>
                <ColorPicker intent="primary" />
                <ColorPicker intent="secondary" />
            </Grid>
            <Button fullWidth variant="contained" onClick={() => {
                setInternalPalette(defaultInternalPalette);
            }}>
                {get("重置")}
            </Button>
        </>
    );
}
export default ColorTool;
