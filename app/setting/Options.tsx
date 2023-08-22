import {
    FormGroup,
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
} from "../layoutClient";
import I18N from "react-intl-universal";
import {
    useState
} from "react";
import { Switcher } from "./Switcher";
declare global {  //设置全局属性
    interface Window {  //window对象属性
        installPWA(): void;
    }
}
export type options = [string, string, "false" | "true"];
export default function Options() {
    var [lang, setLang] = useState<string>("");
    return (
        <FormGroup>
            {([["fork-me-on-github", "Fork me on GitHub", "false"], ["darkmode", "暗色模式", "false"], ["color", "多彩主页", "true"]] as options[]).map((options, index) => (
                <Switcher options={options} index={index} key={options[0]} />
            ))}
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
                {Object.keys(locales).map(ilang => <MenuItem key={ilang} value={ilang}>{ilang}</MenuItem>)}
            </Select>
            <br />
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
