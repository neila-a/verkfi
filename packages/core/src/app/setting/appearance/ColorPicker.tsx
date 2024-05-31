"use client";
import {
    Check as CheckIcon
} from "@mui/icons-material";
import {
    Box,
    Grid,
    Radio,
    Slider,
    Tooltip,
    Typography
} from "@mui/material";
import * as colors from "@mui/material/colors";
import {
    useAtom
} from "jotai";
import {
    get
} from "react-intl-universal";
import hues from "./hues";
import shades from "./shades";
import ColorBar from "./ColorBar";
import internalPaletteAtom from "./internalPaletteAtom";
export default function ColorPicker(props: {
    intent: string;
}) {
    const intent = props.intent,
        [internalPalette, setInternalPalette] = useAtom(internalPaletteAtom),
        realId = `${intent}ShadeSliderLabel`,
        handleChangeHue = name => event => {
            const hue = event.target.value;
            const color = colors[hue][shades[internalPalette[`${name}Shade`]]];
            setInternalPalette({
                ...internalPalette,
                [`${name}Hue`]: hue,
                [name]: color,
                [`${name}Input`]: color
            });
        },
        handleChangeShade = name => (event, shade) => {
            const color = colors[internalPalette[`${name}Hue`]][shades[shade]];
            setInternalPalette({
                ...internalPalette,
                [`${name}Shade`]: shade,
                [name]: color,
                [`${name}Input`]: color
            });
        },
        intentShade = internalPalette[`${intent}Shade`],
        color = internalPalette[`${intent}`];
    return (
        <Grid item>
            <Typography component="label" gutterBottom htmlFor={intent} variant="h6">
                {get(`appearance.${intent}`)}
            </Typography>
            <Box sx={{
                display: "flex",
                alignItems: "center",
                mt: 2,
                mb: 2
            }}>
                <Typography id={realId} sx={{
                    width: 60
                }}>
                    {`${get("appearance.shade")}:`}
                </Typography>
                <Slider
                    sx={{
                        width: "calc(100% - 80px)",
                        ml: 3,
                        mr: 3
                    }}
                    value={intentShade}
                    min={0}
                    max={13}
                    step={1}
                    onChange={handleChangeShade(intent)}
                    aria-labelledby={realId} />
                <Typography>
                    {shades[intentShade]}
                </Typography>
            </Box>
            <Box sx={{
                width: 192
            }}>
                {hues.map(hue => {
                    const shade = intent === "primary" ? shades[internalPalette.primaryShade] : shades[internalPalette.secondaryShade];
                    const backgroundColor = colors[hue][shade];
                    const showHue = get(`appearance.colors.${hue}`);
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
                                icon={(
                                    <Box
                                        sx={{
                                            width: 48,
                                            height: 48
                                        }}
                                        style={{
                                            backgroundColor
                                        }} />
                                )}
                                checkedIcon={(
                                    <Box
                                        sx={{
                                            width: 48,
                                            height: 48,
                                            border: 1,
                                            borderColor: "white",
                                            color: "common.white",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center"
                                        }}
                                        style={{
                                            backgroundColor
                                        }}
                                    >
                                        <CheckIcon style={{
                                            fontSize: 30
                                        }} />
                                    </Box>
                                )} />
                        </Tooltip>
                    );
                })}
            </Box>
            <ColorBar color={color} />
        </Grid>
    );
}
