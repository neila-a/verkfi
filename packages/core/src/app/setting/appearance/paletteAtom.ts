import {
    atom
} from "jotai";
import defaultInternalPalette from "./defaultInternalPalette";
import * as colors from "@mui/material/colors";
import atomWithStorage from "@verkfi/shared/reader/atomWithStorage";
import defaultPalette from "./defaultPalette";
import {
    extendTheme
} from "@mui/material";
import Ubuntu from "@verkfi/shared/fonts";
const internalPaletteAtom = atomWithStorage("internalPalette", "内部调色板", defaultInternalPalette);
export const
    paletteAtom = atom(async get => {
        const internal = await get(internalPaletteAtom);
        return {
            primary: {
                ...colors[internal.primaryHue],
                main: internal.primary
            },
            secondary: {
                ...colors[internal.secondaryHue],
                main: internal.secondary
            }
        } as typeof defaultPalette;
    }),
    themeAtom = atom(async get => {
        const palette = await get(paletteAtom);
        if (typeof extendTheme === "function") {
            return extendTheme({
                cssVarPrefix: "verkfi",
                colorSchemes: {
                    light: {
                        palette
                    },
                    dark: {
                        palette
                    }
                },
                typography: {
                    fontFamily: Ubuntu.style.fontFamily
                }
            });
        }
    });
export default internalPaletteAtom;
