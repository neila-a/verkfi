import {
    FormControlLabel,
    Switch
} from "@mui/material";
import setOption from "./setOption";
import stringToBoolean from "./stringToBoolean";
import useReadSetting from "./useReadSetting";
import I18N from "react-intl-universal";
import {
    options
} from "./Options";
export function Switcher(props: {
    options: options;
    index: number;
}) {
    const {options} = props,
    checked = stringToBoolean(useReadSetting(options[0], options[1], options[2]));
    return (
        <FormControlLabel control={<Switch checked={checked} onChange={event => {
            setOption(options[0], options[1], event.target.checked);
        }} />} label={props.index === 0 ? options[1] : I18N.get(options[1])} />
    );
}
