"use client";
import {
    BrightnessMedium,
    Check as CheckIcon,
    DarkMode,
    LightMode
} from '@mui/icons-material';
import {
    Box,
    Button,
    Grid,
    InputLabel,
    PaletteMode,
    Paper,
    Radio,
    Slider,
    Tooltip,
    Typography
} from '@mui/material';
import * as colors from '@mui/material/colors';
import {
    rgbToHex,
    useTheme
} from '@mui/material/styles';
import {
    useAtom
} from 'jotai';
import {
    darkMode as darkModeAtom,
    gradientTool,
    paletteColors
} from 'layout/layoutClient';
import {
    Dispatch,
    useId
} from 'react';
import {
    get
} from "react-intl-universal";
import {
    Switcher
} from 'setting/option/Switcher';
import useStoragedState from 'useStoragedState';
import defaultInternalPalette from './defaultInternalPalette';
import defaultPalette from './defaultPalette';
import hues from './hues';
import shades from './shades';
function ColorTool() {
    const [palette, setPalette] = useAtom(paletteColors),
        theme = useTheme(),
        [darkMode, setDarkMode] = useAtom(darkModeAtom),
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
            setPalette(paletteColors);
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
    function ColorPicker(props: {
        intent: string;
    }) {
        const {
            intent
        } = props,
            intentShade = internalPalette[`${intent}Shade`],
            realId = `${intent}ShadeSliderLabel`,
            color = internalPalette[`${intent}`];
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
                    <Typography id={realId} sx={{
                        width: 60
                    }}>{`${get("appearance.shade")}:`}</Typography>
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
                        aria-labelledby={realId} />
                    <Typography>{shades[intentShade]}</Typography>
                </Box>
                <Box sx={{
                    width: 192
                }}>
                    {hues.map((hue) => {
                        const shade = intent === 'primary'
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
                                    icon={<Box
                                        sx={{
                                            width: 48,
                                            height: 48
                                        }}
                                        style={{
                                            backgroundColor
                                        }} />}
                                    checkedIcon={<Box
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
                                    </Box>} />
                            </Tooltip>
                        );
                    })}
                </Box>
                <ColorBar color={color} />
            </Grid>
        );
    }
    return (
        <>
            <Switcher option={[gradientTool, "渐变工具"]} key="gradientTool" />
            <Box>
                <InputLabel>
                    {get('appearance.colorMode.text')}
                </InputLabel>
                <Grid container direction="row" spacing={1} sx={{
                    justifyContent: "space-evenly",
                    mb: 2
                }}>
                    {([["light", LightMode], ["dark", DarkMode], ["system", BrightnessMedium]] satisfies [PaletteMode | "system", typeof LightMode][]).map(item => {
                        const isThis = darkMode === item[0],
                            Icon = item[1];
                        return (
                            <Grid item key={item[0]}>
                                <Paper onClick={event => {
                                    setDarkMode(item[0]);
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
                setPalette(defaultPalette);
                setInternalPalette(defaultInternalPalette);
            }}>
                {get("重置")}
            </Button>
        </>
    );
}
export default ColorTool;