"use client";
import {
    Palette,
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
    isBrowser,
    paletteColors
} from '../../layout/layoutClient';
import checkOption from '../checkOption';
import setSetting from '../setSetting';
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
import defaults from './defaults';
import hues from './hues';
import shades from './shades';
import {
    FC,
    useContext,
    useReducer
} from 'react';
import {
    OverridableComponent
} from '@mui/material/OverridableComponent';
function ColorTool() {
    const palette = useContext(paletteColors),
        theme = useTheme(),
        darkMode = useContext(darkModeContext),
        defaultState = JSON.stringify({
            primary: defaults.primary,
            secondary: defaults.secondary,
            primaryInput: defaults.primary,
            secondaryInput: defaults.secondary,
            primaryHue: 'blue',
            secondaryHue: 'pink',
            primaryShade: 4,
            secondaryShade: 11,
        });
    var value = defaultState;
    if (isBrowser()) {
        value = checkOption("internalpalette", "内部调色板", defaultState);
    }
    const [state, setState] = useReducer((old, now) => {
        const paletteColors = {
            primary: { ...colors[now.primaryHue], main: now.primary },
            secondary: { ...colors[now.secondaryHue], main: now.secondary },
        };
        setSetting("internalpalette", "内部调色板", JSON.stringify(now));
        palette.set(JSON.stringify(paletteColors));
        return now;
    }, JSON.parse(value));
    const handleChangeHue = (name) => (event) => {
        const hue = event.target.value;
        const color = colors[hue][shades[state[`${name}Shade`]]];
        setState({
            ...state,
            [`${name}Hue`]: hue,
            [name]: color,
            [`${name}Input`]: color,
        });
    };
    const handleChangeShade = (name) => (event, shade) => {
        const color = colors[state[`${name}Hue`]][shades[shade]];
        setState({
            ...state,
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
        const intentShade = state[`${intent}Shade`];
        const color = state[`${intent}`];
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
                                ? shades[state.primaryShade]
                                : shades[state.secondaryShade];
                        const backgroundColor = colors[hue][shade];
                        const showHue = get(`theme.colors.${hue}`);
                        return (
                            <Tooltip placement="right" title={showHue} key={hue}>
                                <Radio
                                    sx={{
                                        p: 0
                                    }}
                                    color="default"
                                    checked={state[intent] === backgroundColor}
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
                palette.set("__none__");
                setState(JSON.parse(defaultState));
            }}>
                {get("重置")}
            </Button>
        </>
    );
}
export default ColorTool;