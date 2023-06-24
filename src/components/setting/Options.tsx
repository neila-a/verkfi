import {
    FormGroup,
    FormControlLabel,
    Switch
} from "@mui/material";
import setOption from "./setOption";
import stringToBoolean from "./stringToBoolean";
import useReadSetting from "./useReadSetting";
export default function Options() {
    return (
        <FormGroup>
            <FormControlLabel control={
                <Switch checked={stringToBoolean(useReadSetting("fork-me-on-github", "Fork me on GitHub", String(false)))} onChange={event => {
                    setOption("fork-me-on-github", "Fork me on GitHub", event.target.checked)
                }} />
            } label="Fork Me On GitHub" />
        </FormGroup>
    );
}