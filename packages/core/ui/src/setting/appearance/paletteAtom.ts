import {
    atom
} from "jotai";
import defaultInternalPalette from "./defaultInternalPalette";
import * as colors from "@mui/material/colors";
import {
    atomWithStorage
} from "jotai/utils";
import defaultPalette from "./defaultPalette";
import {
    createTheme
} from "@mui/material";
const internalPaletteAtom = atomWithStorage("internalPalette", defaultInternalPalette);
export const
    paletteAtom = atom(get => {
        const got = get(internalPaletteAtom);
        return {
            primary: {
                ...colors[got.primaryHue],
                main: got.primary
            },
            secondary: {
                ...colors[got.secondaryHue],
                main: got.secondary
            }
        } as typeof defaultPalette;
    }),
    themeAtom = atom(get => {
        const palette = get(paletteAtom);
        if (typeof createTheme === "function") {
            return createTheme({
                cssVariables: {
                    cssVarPrefix: "verkfi"
                },
                colorSchemes: {
                    light: {
                        palette
                    },
                    dark: {
                        palette
                    }
                },
                typography: {
                    fontFamily: "Ubuntu"
                }
            });
        }
    });
export default internalPaletteAtom;
