import {
    FormGroup,
    FormControlLabel,
    Switch,
    FromControl,
    InputLabel,
    Select,
    MenuItem
} from "@mui/material";
import setOption from "./setOption";
import {
    locales
} from "../../pages/_app";
import stringToBoolean from "./stringToBoolean";
import useReadSetting from "./useReadSetting";
import setSetting from "./setSetting";
import I18N from "react-intl-universal";
import {
    useState
} from "react";
export default function Options() {
    var [lang, setLang] = useState<string>("");
    return (
        <FormGroup>
            <FormControlLabel control={
                <Switch checked={stringToBoolean(useReadSetting("fork-me-on-github", "Fork me on GitHub", String(false)))} onChange={event => {
                    setOption("fork-me-on-github", "Fork me on GitHub", event.target.checked)
                }} />
            } label="Fork Me On GitHub" />
            <FormControl fullWidth>
                <InputLabel id="lang">
                    {I18N.get("选择语言")}
                </InputLabel>
                <Select labelId="lang" value={lang} label={I18N.get("选择语言")} onChange={event => {
                    I18N.init({
                        currentLocale: String(event.target.value),
                        locales
                    });
                    setSetting("lang", "语言", String(event.target.value))
                }}>
                    {["zhCN", "zhTW", "enUS", "rkRK"].map(ilang => <MenuItem value={ilang}>{ilang}</MenuItem>)}
                </Select>
            </FormControl>
        </FormGroup>
    );
}