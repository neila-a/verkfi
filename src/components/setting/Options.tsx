import {
    FormGroup,
    FormControlLabel,
    Switch,
    InputLabel,
    Select,
    MenuItem
} from "@mui/material";
import setOption from "./setOption";
import {
    locales,
    ColorModeContext
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
            <FormControlLabel control={
                <Switch checked={stringToBoolean(useReadSetting("darkmode", "暗色模式", "light").replace("light", "false").replace("dark", "true"))} onChange={ColorModeContext.toggleColorMode} />
            } label={I18N.get("暗色模式")} />
                <InputLabel id="lang">
                    {I18N.get("选择语言")}
                </InputLabel>
                <Select labelId="lang" value={lang} label={I18N.get("选择语言")} onChange={event => {
                    const plang = String(event.target.value);
                    I18N.init({
                        currentLocale: plang,
                        locales
                    });
                    setSetting("lang", "语言", plang);
                    setLang(plang);
                    location.reload();
                }}>
                    {["zhCN", "zhTW", "enUS", "rkRK"].map(ilang => <MenuItem key={ilang} value={ilang}>{ilang}</MenuItem>)}
                </Select>
        </FormGroup>
    );
}
