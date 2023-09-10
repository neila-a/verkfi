"use client";
import {
    FormGroup,
    InputLabel,
    Select,
    MenuItem,
    Button,
    ButtonGroup,
    Typography
} from "@mui/material";
import {
    Download as DownloadIcon
} from "@mui/icons-material"
import setOption from "../setOption";
import {
    locales
} from "../../layoutClient";
import I18N from "react-intl-universal";
import {
    useState
} from "react";
import {
    Switcher
} from "../Switcher";
import {
    stringifyCheck
} from "../Switcher";
import PureDialog from "../../components/dialog/PureDialog";
export type options = [string, string, stringifyCheck];
export default function Options() {
    var [lang, setLang] = useState<string>(""),
        [dialogOpen, setDialogOpen] = useState<boolean>(false);
    return (
        <FormGroup>
            <Typography variant='h4'>
                {I18N.get('选项')}
            </Typography>
            {([["fork-me-on-github", "Fork me on GitHub", "false"], ["darkmode", "暗色模式", "false"], ["color", "多彩主页", "true"]] as options[]).map((options, index) => (
                <Switcher options={options} index={index} key={options[0]} />
            ))}
            <InputLabel id="lang">
                {I18N.get("选择语言")}
            </InputLabel>
            <Select labelId="lang" value={lang} label={I18N.get("选择语言")} onChange={event => {
                const plang = event.target.value;
                I18N.init({
                    currentLocale: plang,
                    locales
                });
                setLang(plang);
                setOption("lang", "语言", plang);
            }}>
                {Object.values(locales).map(ilang => {
                    const {
                        langName
                    } = ilang,
                        langId = Object.keys(locales).find(key => locales[key] == ilang);
                    return (
                        <MenuItem key={langName} value={langId}>{langName}</MenuItem>
                    )
                })}
            </Select>
            <br />
            <Button variant="contained" startIcon={
                <DownloadIcon />
            } onClick={() => {
                setDialogOpen(true);
            }}>
                {I18N.get("下载本应用")}
            </Button>
            {dialogOpen && <PureDialog title={I18N.get("下载本应用")} onClose={() => {
                setDialogOpen(false);
            }}>
                <ButtonGroup variant="contained" fullWidth>
                    <Button onClick={event => {
                        window.installPWA();
                    }}>
                        {I18N.get("将本应用通过浏览器添加至桌面")}
                    </Button>
                    <Button onClick={event => {
                        window.location.href = "https://github.com/neila-a/NeilaTools/releases";
                    }}>
                        {I18N.get("下载单独安装包")}
                    </Button>
                </ButtonGroup>
            </PureDialog>}
        </FormGroup>
    );
}
