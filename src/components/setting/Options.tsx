import {
    FormGroup,
    FormControlLabel,
    Switch,
    InputLabel,
    Select,
    MenuItem,
    Button
} from "@mui/material";
import {
    Download as DownloadIcon
} from "@mui/icons-material"
import setOption from "./setOption";
import {
    locales
} from "../../pages/_app";
import stringToBoolean from "./stringToBoolean";
import useReadSetting from "./useReadSetting";
import I18N from "react-intl-universal";
import {
    useState
} from "react";
declare global {  //设置全局属性
    interface Window {  //window对象属性
        installPWA(): void;
    }
}
export default function Options() {
    var [lang, setLang] = useState<string>("");
    return (
        <FormGroup>
            <FormControlLabel control={
                <Switch checked={stringToBoolean(useReadSetting("fork-me-on-github", "Fork me on GitHub", "false"))} onChange={event => {
                    setOption("fork-me-on-github", "Fork me on GitHub", event.target.checked)
                }} />
            } label="Fork Me On GitHub" />
            <FormControlLabel control={
                <Switch checked={stringToBoolean(useReadSetting("darkmode", "暗色模式", "false"))} onChange={event => {
                    setOption("darkmode", "暗色模式", event.target.checked);
                }} />
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
                    setLang(plang);
                    setOption("lang", "语言", plang);
                }}>
                    {["zhCN", "zhTW", "enUS", "rkRK"].map(ilang => <MenuItem key={ilang} value={ilang}>{ilang}</MenuItem>)}
                </Select>
            <br>
            <Button variant="contained" startIcon={
            <DownloadIcon />
            } onClick={() => {
                window.installPWA();
        }}>
                {I18N.get("下载本应用")}
            </Button>
        </FormGroup>
    );
}
