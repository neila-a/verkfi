"use client";
import {
    FormGroup,
    InputLabel,
    Select,
    MenuItem,
    Button,
    ButtonGroup,
    Typography,
    Box,
    Grid,
    Theme
} from "@mui/material";
import {
    CallToActionOutlined,
    Download as DownloadIcon,
    Help as HelpIcon,
    ViewSidebar as ViewSidebarIcon
} from "@mui/icons-material";
import {
    colorMode,
    forkMeOnGitHub,
    lang as langContext,
    locales
} from "../../layout/layoutClient";
import {
    get
} from "react-intl-universal";
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
import Module from "./Module";
const PureDialog = dynamic(() => import("../../components/dialog/PureDialog")),
    ghURL = "https://github.com/neila-a/verkfi/";
export type option = [Context<any>, string];
export default function Options() {
    const lang = useContext(langContext),
        [dialogOpen, setDialogOpen] = useState<boolean>(false),
        router = useRouter();
    return (
        <FormGroup>
            <Typography variant='h4'>
                {get('选项')}
            </Typography>
            {([[forkMeOnGitHub, "Fork me on GitHub"], [colorMode, "多彩主页"]] as option[]).map(options => (
                <Switcher option={options} key={options[1]} />
            ))}
            <InputLabel>
                {get('option.菜单模式')}
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
            <InputLabel id="lang">
                {get("选择语言")}
            </InputLabel>
            <Select labelId="lang" value={lang.value} label={get("选择语言")} onChange={event => {
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
                    {get("download.下载本应用")}
                </Button>
                <Button variant="outlined" startIcon={<HelpIcon />} onClick={event => {
                    router.push("https://neila.gitbook.io/verkfi/");
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
                    <Button onClick={event => {
                        router.push(`${ghURL}releases`);
                    }}>
                        {get("download.下载单独安装包")}
                    </Button>
                </ButtonGroup>
            </PureDialog>
        </FormGroup >
    );
}
