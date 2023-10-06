import {
    FormControlLabel,
    PaletteMode,
    Switch
} from "@mui/material";
import I18N from "react-intl-universal";
import {
    option
} from "./option/page";
import {
    Dispatch,
    useContext
} from "react";
import stringToBoolean from "./stringToBoolean";
export type stringifyCheck = "false" | "true";
export function Switcher(props: {
    option: option;
    index: number;
}) {
    const {
        option
    } = props,
        value = useContext(option[0]),
        isDarkMode = option[1] === "暗色模式",
        isForkMeOnGitHub = option[1] === "Fork me on GitHub";
    return (
        <FormControlLabel control={<Switch checked={stringToBoolean(isDarkMode ? (value.mode as PaletteMode).replace("light", "false").replace("dark", "true") : value.value as stringifyCheck)} onChange={event => {
            (value.set as Dispatch<any>)(isDarkMode ? ((value.mode as PaletteMode) === "dark" ? "light" : "dark") : String((!stringToBoolean(value.value as stringifyCheck))));
        }} />} label={isForkMeOnGitHub ? option[1] : I18N.get(option[1])} />
    );
}
