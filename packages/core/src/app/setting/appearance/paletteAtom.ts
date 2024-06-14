import {
    atom
} from "jotai";
import defaultInternalPalette from "./defaultInternalPalette";
import * as colors from "@mui/material/colors";
import atomWithStorage from "@verkfi/shared/reader/atomWithStorage";
import defaultPalette from "./defaultPalette";
const internalPaletteAtom = atomWithStorage("internalPalette", "内部调色板", defaultInternalPalette);
export const paletteAtom = atom(async get => {
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
});
export default internalPaletteAtom;
