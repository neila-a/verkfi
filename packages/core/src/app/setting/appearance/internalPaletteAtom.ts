import {
    atom
} from "jotai";
import defaultInternalPalette from "./defaultInternalPalette";
import defaultPalette from "./defaultPalette";
import * as colors from "@mui/material/colors";
import {
    paletteColors as paletteColorsAtom
} from "@verkfi/shared/atoms";
import atomWithStorage from "@verkfi/shared/reader/atomWithStorage";
const valueAtom = atomWithStorage("internalPalette", "内部调色板", defaultInternalPalette),
    internalPaletteAtom = atom(get => get(valueAtom), (get, set, update: typeof defaultInternalPalette) => {
        set(valueAtom, update);
        const paletteColors: typeof defaultPalette = {
            primary: {
                ...colors[update.primaryHue],
                main: update.primary
            },
            secondary: {
                ...colors[update.secondaryHue],
                main: update.secondary
            }
        };
        set(paletteColorsAtom, paletteColors);
    });
export default internalPaletteAtom;
