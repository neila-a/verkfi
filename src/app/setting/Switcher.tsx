import {
    FormControlLabel,
    Switch
} from "@mui/material";
import setOption from "./setOption";
import I18N from "react-intl-universal";
import {
    options
} from "./option/page";
import {
    useState
} from "react";
import checkOption from "./checkOption";
import stringToBoolean from "./stringToBoolean";
export type stringifyCheck = "false" | "true";
export function Switcher(props: {
    options: options;
    index: number;
}) {
    const {
        options
    } = props,
        [checked, setChecked] = useState<stringifyCheck>(() => {
            const check = checkOption(options[0], options[1], options[2]) as stringifyCheck;
            return check || options[2];
        });
    return (
        <FormControlLabel control={<Switch checked={stringToBoolean(checked)} onChange={event => {
            setOption(options[0], options[1], event.target.checked);
        }} />} label={props.index === 0 ? options[1] : I18N.get(options[1])} />
    );
}
