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
    Download as DownloadIcon,
    Help as HelpIcon
} from "@mui/icons-material";
import {
    colorMode,
    darkMode,
    forkMeOnGitHub,
    lang as langContext,
    locales
} from "../../layoutClient";
import I18N from "react-intl-universal";
import {
    Context,
    useContext,
    useState
} from "react";
import {
    Switcher
} from "../Switcher";
import dynamic from 'next/dynamic';
import {
    useRouter
} from "next/navigation";
const PureDialog = dynamic(() => import("../../components/dialog/PureDialog")),
    ghURL = "https://github.com/neila-a/NeilaTools/";
export type option = [Context<any>, string];
export default function Options() {
    var lang = useContext(langContext),
        [dialogOpen, setDialogOpen] = useState<boolean>(false),
        router = useRouter();
    return (
        <FormGroup>
            <Typography variant='h4'>
                {I18N.get('选项')}
            </Typography>
            {([[forkMeOnGitHub, "Fork me on GitHub"], [darkMode, "暗色模式"], [colorMode, "多彩主页"]] as option[]).map((options, index) => (
                <Switcher option={options} index={index} key={options[1]} />
            ))}
            <InputLabel id="lang">
                {I18N.get("选择语言")}
            </InputLabel>
            <Select labelId="lang" value={lang.value} label={I18N.get("选择语言")} onChange={event => {
                const plang = event.target.value;
                lang.set(plang);
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
            <ButtonGroup fullWidth>
                <Button variant="contained" startIcon={<DownloadIcon />} onClick={() => {
                    setDialogOpen(true);
                }}>
                    {I18N.get("下载本应用")}
                </Button>
                <Button variant="outlined" startIcon={<HelpIcon />} onClick={event => {
                    router.push(`${ghURL}wiki`);
                }}>
                    {I18N.get("帮助")}
                </Button>
            </ButtonGroup>
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
                        router.push(`${ghURL}releases`);
                    }}>
                        {I18N.get("下载单独安装包")}
                    </Button>
                </ButtonGroup>
            </PureDialog>}
        </FormGroup>
    );
}
