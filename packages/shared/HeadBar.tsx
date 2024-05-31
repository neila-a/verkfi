import {
    ArrowBack,
    Menu as MenuIcon,
    MenuOpen,
    Settings as SettingsIcon,
    Share as ShareIcon
} from "@mui/icons-material";
import {
    AppBar,
    Box,
    IconButton,
    Toolbar,
    Typography
} from "@mui/material";
import {
    SxProps,
    Theme
} from "@mui/material/styles";
import {
    useAtom
} from "jotai";
import {
    repoInfo as repoInfoContext
} from "layout/layoutClient";
import {
    forkMeOnGitHub as forkMeOnGitHubAtom,
    share as shareAtom,
    showSidebar
} from "./atoms";
import Link from "next/link";
import {
    useRouter
} from "next/navigation";
import {
    CSSProperties,
    Fragment,
    useContext
} from "react";
import {
    get
} from "react-intl-universal";
import MouseOverPopover from "./Popover";
export interface HeadBarOption {
    pageName: string;
    isIndex: boolean;
    only?: boolean;
    sx?: SxProps<Theme>;
}
/**
 * AppBar 的自定义封装。
 * @param {boolean} isIndex 是否是索引页面
 * @param {string} pageName 页面的名称
 * @param {boolean} only 是否隐藏
 * @param {SxProps<Theme>} sx 添加的样式
 */
export default function HeadBar(props: HeadBarOption): JSX.Element {
    const repoInfoName = useContext(repoInfoContext).name,
        [forkMeOnGithub] = useAtom(forkMeOnGitHubAtom),
        router = useRouter(),
        upper = repoInfoName.charAt(0).toUpperCase() + repoInfoName.slice(1),
        [share] = useAtom(shareAtom),
        [showSidebarValue, setShowSidebar] = useAtom(showSidebar),
        noDrag: CSSProperties = {
            // @ts-ignore React的CSSProperties中明明有WebkitAppRegion，但是类型中没有
            WebkitAppRegion: "no-drag"
        };
    return !props.only && (
        <>
            <AppBar position="fixed" sx={{
                WebkitAppRegion: "drag",
                zIndex: "38600",
                left: 0,
                width: "100vw",
                opacity: 0.95,
                ...props.sx
            }}>
                <Toolbar>
                    <nav>
                        {!props.isIndex && (
                            <MouseOverPopover text={get("上一页")} sx={noDrag}>
                                <IconButton size="large" edge="start" color="inherit" aria-label={get("上一页")} sx={{
                                    mr: 2
                                }} onClick={event => {
                                    router.back();
                                }}>
                                    <ArrowBack />
                                </IconButton>
                            </MouseOverPopover>
                        )}
                    </nav>
                    <Typography variant="h6" component="div" sx={{
                        flexGrow: 1,
                        textAlign: props.isIndex && "center"
                    }}>
                        {props.isIndex ? upper : props.pageName}
                    </Typography>
                    {!props.isIndex && (
                        showSidebarValue ? (
                            <MouseOverPopover text={get("menu.关闭菜单")}>
                                <IconButton onClick={event => {
                                    setShowSidebar(!showSidebarValue);
                                }} size="large" edge="end" color="inherit" aria-label={get("menu.关闭菜单")} sx={{
                                    mr: 1,
                                    ...noDrag
                                }}>
                                    <MenuOpen />
                                </IconButton>
                            </MouseOverPopover>
                        ) : (
                            <MouseOverPopover text={get("menu.打开菜单")}>
                                <IconButton onClick={event => {
                                    setShowSidebar(!showSidebarValue);
                                }} size="large" edge="end" color="inherit" aria-label={get("menu.打开菜单")} sx={{
                                    mr: 1,
                                    ...noDrag
                                }}>
                                    <MenuIcon />
                                </IconButton>
                            </MouseOverPopover>
                        )
                    )}
                    <title>
                        {props.isIndex ? upper : `${props.pageName} | ${upper}`}
                    </title>
                    {share && (
                        <MouseOverPopover text={get("share.t")}>
                            <IconButton onClick={async event => {
                                if ("share" in navigator) {
                                    await navigator.share({
                                        title: props.isIndex ? upper : props.pageName,
                                        text: document.title,
                                        url: location.href
                                    });
                                }
                            }} size="large" edge="end" color="inherit" aria-label={get("share.t")} sx={{
                                mr: 1
                            }}>
                                <ShareIcon />
                            </IconButton>
                        </MouseOverPopover>
                    )}
                    <nav style={{
                        display: "flex",
                        alignItems: "center",
                        ...noDrag
                    }}>
                        <Link href="/setting/option" style={{
                            color: "inherit"
                        }}>
                            <MouseOverPopover text={get("设置")}>
                                <IconButton size="large" edge="end" color="inherit" aria-label={get("设置")} sx={{
                                    mr: 1
                                }}>
                                    <SettingsIcon />
                                </IconButton>
                            </MouseOverPopover>
                        </Link>
                    </nav>
                </Toolbar>
            </AppBar >
            {
                forkMeOnGithub ? (
                    <Box sx={{
                        position: "fixed",
                        width: 150,
                        height: 150,
                        overflow: "hidden",
                        zIndex: "99999",
                        top: 0,
                        [props.isIndex ? "left" : "right"]: 0
                    }}>
                        <a href="https://github.com/neila-a/verkfi.git" style={{
                            transform: props.isIndex ? "rotate(-45deg)" : "rotate(45deg)",
                            [props.isIndex ? "left" : "right"]: -40,
                            display: "inline-block",
                            width: 200,
                            overflow: "hidden",
                            padding: "6px 0px",
                            textAlign: "center",
                            textDecoration: "none",
                            color: "rgb(255, 255, 255)",
                            position: "inherit",
                            borderWidth: "1px 0px",
                            borderStyle: "dotted",
                            borderColor: "rgba(255, 255, 255, 0.7)",
                            fontWeight: 700,
                            fontSize: 13,
                            boxShadow: "rgba(0, 0, 0, 0.5) 0px 2px 3px 0px",
                            backgroundColor: "rgb(170, 0, 0)",
                            backgroundImage: "linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.15))",
                            top: 45
                        }}>
                            Fork me on GitHub
                        </a>
                    </Box>
                ) : <Fragment />
            }

            < Toolbar />
        </>
    );
}
