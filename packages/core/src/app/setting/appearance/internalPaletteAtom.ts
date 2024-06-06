import {
    atom
} from "jotai";
import defaultInternalPalette from "./defaultInternalPalette";
import settingReader from "@verkfi/shared/reader/settingReader";
import defaultPalette from "./defaultPalette";
import * as colors from "@mui/material/colors";
import {
    paletteColors as paletteColorsAtom
} from "@verkfi/shared/atoms";
const emptyString = "__empty__",
    valueAtom = atom<typeof emptyString | typeof defaultInternalPalette>(emptyString),
    internalPaletteAtom = atom(get => {
        const got = get(valueAtom);
        if (got === emptyString) {
            return settingReader("internalPalette", defaultInternalPalette);
        }
        return got as typeof defaultInternalPalette;
    }, (get, set, update: typeof defaultInternalPalette) => {
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
