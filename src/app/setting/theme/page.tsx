"use client";
import * as React from 'react';
import {
    rgbToHex,
    useTheme
} from '@mui/material/styles';
import * as colors from '@mui/material/colors';
import {
    Check as CheckIcon
} from '@mui/icons-material';
import {
    capitalize
} from '@mui/material/utils';
import I18N from "react-intl-universal";
import {
    darkMode,
    isBrowser,
    paletteColors
} from '../../layoutClient';
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
    InputLabel
} from '@mui/material';
import {
    Switcher
} from '../Switcher';
const defaults = {
    primary: '#2196f3',
    secondary: '#f50057',
};
const hues = [
    'red',
    'pink',
    'purple',
    'deepPurple',
    'indigo',
    'blue',
    'lightBlue',
    'cyan',
    'teal',
    'green',
    'lightGreen',
    'lime',
    'yellow',
    'amber',
    'orange',
    'deepOrange'
];
const shades = [
    900,
    800,
    700,
    600,
    500,
    400,
    300,
    200,
    100,
    50,
    'A700',
    'A400',
    'A200',
    'A100',
];
function ColorTool() {
    const palette = React.useContext(paletteColors);
    const theme = useTheme();
    const defaultState = JSON.stringify({
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
    const [state, setState] = React.useReducer((old, now) => {
        const paletteColors = {
            primary: { ...colors[now.primaryHue], main: now.primary },
            secondary: { ...colors[now.secondaryHue], main: now.secondary },
        };
        setSetting("internalpalette", "内部调色板", JSON.stringify(now));
        palette.set(JSON.stringify(paletteColors));
        return now;
    }, JSON.parse(value));
    const handleChangeColor = (name) => (event) => {
        const isRgb = (string) =>
            /rgb\([0-9]{1,3}\s*,\s*[0-9]{1,3}\s*,\s*[0-9]{1,3}\)/i.test(string);
        const isHex = (string) => /^#?([0-9a-f]{3})$|^#?([0-9a-f]){6}$/i.test(string);
        let {
            target: { value: color },
        } = event;
        setState((prevState) => ({
            ...prevState,
            [`${name}Input`]: color,
        }));
        let isValidColor = false;
        if (isRgb(color)) {
            isValidColor = true;
        } else if (isHex(color)) {
            isValidColor = true;
            if (color.indexOf('#') === -1) {
                color = `#${color}`;
            }
        }
        if (isValidColor) {
            setState((prevState) => ({
                ...prevState,
                [name]: color,
            }));
        }
    };
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
    const ColorBar = ({ color }) => {
        const background = theme.palette.augmentColor({
            color: {
                main: color,
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
                        }}
                        style={{ backgroundColor: background[key] }}
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
                    {I18N.get(intent)}
                </Typography>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mt: 2,
                    mb: 2
                }}>
                    <Typography id={`${intent}ShadeSliderLabel`} sx={{
                        width: 60
                    }}>{`${I18N.get("shade")}:`}</Typography>
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
                        const showHue = I18N.get(hue);
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
            <Switcher option={[darkMode, "暗色模式"]} />
            <Grid container spacing={5} sx={{
                p: 0,
                mb: 2
            }}>
                <ColorPicker intent="primary" />
                <ColorPicker intent="secondary" />
            </Grid>
            <Button fullWidth variant="contained" onClick={event => {
                palette.set("__none__");
                setState(JSON.parse(defaultState));
            }}>
                {I18N.get("重置")}
            </Button>
        </>
    );
}
export default ColorTool;