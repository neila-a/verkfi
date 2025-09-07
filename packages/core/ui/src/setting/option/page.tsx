"use client";
import {
    CallToActionOutlined,
    Download as DownloadIcon,
    GitHub,
    Help as HelpIcon,
    ViewSidebar as ViewSidebarIcon
} from "@mui/icons-material";
import {
    Button,
    ButtonGroup,
    FormGroup,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Typography
} from "@mui/material";
import {
    useAtom
} from "jotai";
import langAtom from "@verkfi/shared/atoms/lang";
import {
    locales
} from "layout/layoutClient";
import {
    forkMeOnGitHubAtom,
    shareAtom
} from "@verkfi/shared/atoms";
import {
    startTransition,
    useId,
    useState
} from "react";
import {
    get
} from "react-intl-universal";
import Module from "./Module";
import {
    Switcher
} from "./Switcher";
import PureDialog from "@verkfi/shared/dialog/Pure";
const ghURL = "https://github.com/neila-a/verkfi/",
    options = [[forkMeOnGitHubAtom, "Fork me on GitHub"], [shareAtom, "share.t"]] satisfies option[];
export type option = [typeof shareAtom, string];
export default function Options() {
    const [lang, setLang] = useAtom(langAtom),
        [dialogOpen, setDialogOpen] = useState(false),
        langId = useId();
    return (
        <FormGroup>
            <Typography variant="h4">
                {get("选项")}
            </Typography>
            {options.map(option => <Switcher option={option} key={option[1]} />)}
            <InputLabel>
                {get("option.菜单模式")}
            </InputLabel>
            <Grid container direction="row" spacing={1} sx={{
                justifyContent: "space-evenly"
            }}>
                <Module mode="menu">
                    <CallToActionOutlined sx={{
                        fontSize: "500%",
                        color: theme => theme.palette.primary.main
                    }} />
                    {get("option.menuModes.菜单窗口")}
                </Module>
                <Module mode="sidebar">
                    <ViewSidebarIcon sx={{
                        fontSize: "500%",
                        color: theme => theme.palette.primary.main
                    }} />
                    {get("option.menuModes.侧边栏")}
                </Module>
            </Grid>
            <InputLabel id={langId}>
                {get("选择语言")}
            </InputLabel>
            <Select labelId={langId} value={lang} label={get("选择语言")} onChange={event => {
                const plang = event.target.value as typeof lang;
                startTransition(() => setLang(plang));
            }}>
                {Object.values(locales).map(ilang => {
                    const langId = Object.keys(locales).find(key => locales[key] === ilang),
                        {
                            langName
                        } = ilang;
                    return (
                        <MenuItem key={langName} value={langId}>
                            {langName}
                        </MenuItem>
                    );
                })}
                <MenuItem value="system">
                    {get("appearance.colorMode.system")}
                </MenuItem>
            </Select>
            <br />
            <ButtonGroup fullWidth>
                <Button variant="contained" startIcon={<DownloadIcon />} onClick={() => {
                    setDialogOpen(true);
                }}>
                    {get("download.下载本应用")}
                </Button>
                <Button variant="outlined" startIcon={<HelpIcon />} onClick={event => {
                    location.href = "https://neila.gitbook.io/verkfi/";
                }}>
                    {get("帮助")}
                </Button>
            </ButtonGroup>
            <PureDialog open={dialogOpen} title={get("download.下载本应用")} onClose={() => {
                setDialogOpen(false);
            }}>
                <ButtonGroup variant="contained" fullWidth>
                    <Button onClick={event => {
                        window.installPWA();
                    }}>
                        {get("download.将本应用通过浏览器添加至桌面")}
                    </Button>
                    <Button startIcon={<GitHub />} onClick={event => {
                        location.href = `${ghURL}releases`;
                    }}>
                        {get("download.下载单独安装包")}
                    </Button>
                </ButtonGroup>
            </PureDialog>
        </FormGroup >
    );
}
