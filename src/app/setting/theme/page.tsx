"use client";
import {
    rgbToHex,
    useTheme
} from '@mui/material/styles';
import * as colors from '@mui/material/colors';
import {
    BrightnessMedium,
    Check as CheckIcon, DarkMode, Light, LightMode
} from '@mui/icons-material';
import {
    get
} from "react-intl-universal";
import {
    darkMode as darkModeContext,
    paletteColors
} from '../../layout/layoutClient';
import {
    Button,
    Box,
    Grid,
    Radio,
    Tooltip,
    Typography,
    Slider,
    Paper,
    PaletteMode,
    SvgIconTypeMap,
    InputLabel
} from '@mui/material';
import hues from './hues';
import shades from './shades';
import {
    Dispatch,
    FC,
    useContext
} from 'react';
import {
    OverridableComponent
} from '@mui/material/OverridableComponent';
import useStoragedState from '../../components/useStoragedState';
import defaultInternalPalette from './defaultInternalPalette';
export const defaultPalette = {
    // 来自palette的快照
    "primary": {
        "50": "#e3f2fd",
        "100": "#bbdefb",
        "200": "#90caf9",
        "300": "#64b5f6",
        "400": "#42a5f5",
        "500": "#2196f3",
        "600": "#1e88e5",
        "700": "#1976d2",
        "800": "#1565c0",
        "900": "#0d47a1",
        "A100": "#82b1ff",
        "A200": "#448aff",
        "A400": "#2979ff",
        "A700": "#2962ff",
        "main": "#2196f3"
    },
    "secondary": {
        "50": "#fce4ec",
        "100": "#f8bbd0",
        "200": "#f48fb1",
        "300": "#f06292",
        "400": "#ec407a",
        "500": "#e91e63",
        "600": "#d81b60",
        "700": "#c2185b",
        "800": "#ad1457",
        "900": "#880e4f",
        "A100": "#ff80ab",
        "A200": "#ff4081",
        "A400": "#f50057",
        "A700": "#c51162",
        "main": "#f50057"
    }
};
function ColorTool() {
    const palette = useContext(paletteColors),
        theme = useTheme(),
        darkMode = useContext(darkModeContext),
        [internalPalette, baseSetInternalPalette] = useStoragedState("internalPalette", "内部调色板", defaultInternalPalette),
        setInternalPalette: Dispatch<typeof defaultInternalPalette> = now => {
            baseSetInternalPalette(now);
            const paletteColors: typeof defaultPalette = {
                primary: {
                    ...colors[now.primaryHue],
                    main: now.primary
                },
                secondary: {
                    ...colors[now.secondaryHue],
                    main: now.secondary
                },
            };
            palette.set(paletteColors);
        };
    const handleChangeHue = (name) => (event) => {
        const hue = event.target.value;
        const color = colors[hue][shades[internalPalette[`${name}Shade`]]];
        setInternalPalette({
            ...internalPalette,
            [`${name}Hue`]: hue,
            [name]: color,
            [`${name}Input`]: color,
        });
    };
    const handleChangeShade = (name) => (event, shade) => {
        const color = colors[internalPalette[`${name}Hue`]][shades[shade]];
        setInternalPalette({
            ...internalPalette,
            [`${name}Shade`]: shade,
            [name]: color,
            [`${name}Input`]: color,
        });
    };
    const ColorBar = ({
        color
    }) => {
        const background = theme.palette.augmentColor({
            color: {
                main: color
            },
        });
        return (
            <Grid container sx={{
                mt: 2
            }}>
                {['dark', 'main', 'light'].map((key) => (
                    <Box
                        sx={{
                            width: 64,
                            height: 64,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: background[key]
                        }}
                        key={key}
                    >
                        <Typography
                            variant="caption"
                            style={{
                                color: theme.palette.getContrastText(background[key]),
                            }}
                        >
                            {rgbToHex(background[key])}
                        </Typography>
                    </Box>
                ))}
            </Grid>
        );
    };
    const ColorPicker = (props: {
        intent: string
    }) => {
        const {
            intent
        } = props;
        const intentShade = internalPalette[`${intent}Shade`];
        const color = internalPalette[`${intent}`];
        return (
            <Grid item>
                <Typography component="label" gutterBottom htmlFor={intent} variant="h6">
                    {get(`theme.${intent}`)}
                </Typography>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mt: 2,
                    mb: 2
                }}>
                    <Typography id={`${intent}ShadeSliderLabel`} sx={{
                        width: 60
                    }}>{`${get("theme.shade")}:`}</Typography>
                    <Slider
                        sx={{
                            width: 'calc(100% - 80px)',
                            ml: 3,
                            mr: 3
                        }}
                        value={intentShade}
                        min={0}
                        max={13}
                        step={1}
                        onChange={handleChangeShade(intent)}
                        aria-labelledby={`${intent}ShadeSliderLabel`}
                    />
                    <Typography>{shades[intentShade]}</Typography>
                </Box>
                <Box sx={{
                    width: 192
                }}>
                    {hues.map((hue) => {
                        const shade =
                            intent === 'primary'
                                ? shades[internalPalette.primaryShade]
                                : shades[internalPalette.secondaryShade];
                        const backgroundColor = colors[hue][shade];
                        const showHue = get(`theme.colors.${hue}`);
                        return (
                            <Tooltip placement="right" title={showHue} key={hue}>
                                <Radio
                                    sx={{
                                        p: 0
                                    }}
                                    color="default"
                                    checked={internalPalette[intent] === backgroundColor}
                                    onChange={handleChangeHue(intent)}
                                    value={hue}
                                    name={intent}
                                    icon={
                                        <Box
                                            sx={{
                                                width: 48,
                                                height: 48
                                            }}
                                            style={{
                                                backgroundColor
                                            }}
                                        />
                                    }
                                    checkedIcon={
                                        <Box
                                            sx={{
                                                width: 48,
                                                height: 48,
                                                border: 1,
                                                borderColor: 'white',
                                                color: 'common.white',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                            style={{
                                                backgroundColor
                                            }}
                                        >
                                            <CheckIcon style={{
                                                fontSize: 30
                                            }} />
                                        </Box>
                                    }
                                />
                            </Tooltip>
                        );
                    })}
                </Box>
                <ColorBar color={color} />
            </Grid>
        );
    };
    return (
        <>
            <InputLabel>
                {get('theme.colorMode.text')}
            </InputLabel>
            <Grid container direction="row" spacing={1} sx={{
                justifyContent: "space-evenly",
                mb: 2
            }}>
                {([["light", LightMode], ["dark", DarkMode], ["system", BrightnessMedium]] as [PaletteMode | "system", (OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
                    muiName: string
                }) | FC][]).map(item => {
                    const isThis = darkMode.mode === item[0],
                        Icon = item[1];
                    return <Grid item key={item[0]}>
                        <Paper onClick={event => {
                            darkMode.set(item[0]);
                        }} sx={{
                            p: 2,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            boxShadow: theme => isThis && `inset 0 0 0 3px ${theme.palette.primary[theme.palette.mode]}`,
                            borderColor: theme => isThis && theme.palette.primary[theme.palette.mode]
                        }}>
                            <Icon sx={{
                                fontSize: "10vw",
                                color: theme => theme.palette.primary.main
                            }} />
                            {get(`theme.colorMode.${item[0]}`)}
                        </Paper>
                    </Grid>;
                })}
            </Grid>
            <Grid container spacing={5} sx={{
                p: 0,
                mb: 2
            }}>
                <ColorPicker intent="primary" />
                <ColorPicker intent="secondary" />
            </Grid>
            <Button fullWidth variant="contained" onClick={() => {
                palette.set(defaultPalette);
                setInternalPalette(defaultInternalPalette);
            }}>
                {get("重置")}
            </Button>
        </>
    );
}
export default ColorTool;