import I18N from 'react-intl-universal';
import {
	AppBar,
	Toolbar,
	IconButton,
	Typography,
	FormGroup,
	FormControl,
	PaletteMode
} from "@mui/material";
import {
	useRouter
} from 'next/navigation'
import ErrorBoundary from "../ErrorBoundary";
import {
	ArrowBack,
	Settings as SettingsIcon,
	LightMode,
	DarkMode,
	ArrowBackIos as ArrowBackIos,
	ArrowForwardIos as ArrowForward
} from "@mui/icons-material"
import {
	CSSProperties,
	Fragment,
	useContext,
	useState
} from "react";
import style from "./HeadBar.module.scss";
import LpLogger from "lp-logger";
import MouseOverPopover from "../Popover";
import {
	Theme
} from "@emotion/react";
import stringToBoolean from "../../setting/stringToBoolean";
var logger = new LpLogger({
	name: "HeadBar",
	level: "log", // 空字符串时，不显示任何信息
});
import {
	SxProps
} from '@mui/material/styles';
import Link from 'next/link';
import {
	darkMode as darkModeContext,
	forkMeOnGitHub as forkMeOnGitHubContext,
	showSidebar
} from '../../layoutClient';
import {
	stringifyCheck
} from '../../setting/Switcher';
export interface HeadBarOption {
	pageName: string;
	isIndex: boolean;
	only?: boolean;
	sx?: SxProps<Theme>;
};
/**
 * AppBar 的自定义封装。
 * @param {boolean} isIndex 是否是索引页面
 * @param {string} pageName 页面的名称
 * @param {boolean} only 是否隐藏
 * @param {SxProps<Theme>} sx 添加的样式
 */
export default function HeadBar(props: HeadBarOption): JSX.Element {
	var forkMeOnGithub = useContext(forkMeOnGitHubContext),
		darkModeFormStorage = useContext(darkModeContext),
		router = useRouter(),
		darkMode = stringToBoolean(darkModeFormStorage.mode.replace("light", "false").replace("dark", "true"));
	const noDrag: CSSProperties = {
		// @ts-ignore React的CSSProperties中明明有WebkitAppRegion，但是类型中没有
		WebkitAppRegion: "no-drag",
	};
	return props.only ? <Fragment /> : <>
		<AppBar position="fixed" sx={{
			WebkitAppRegion: "drag",
			zIndex: 38600,
			left: 0,
			width: "100vw",
			...props.sx
		}}>
			<Toolbar>
				<nav>
					{props.isIndex ? <MouseOverPopover text={I18N.get("暗色模式")}>
						<IconButton size='large' edge="start" color="inherit" aria-label="darkmode" sx={{
							mr: 2
						}} onClick={event => {
							darkModeFormStorage.set(darkModeFormStorage.mode === "light" ? "dark" : "light");
						}}>
							{!darkMode ? <DarkMode /> : <LightMode />}
						</IconButton>
					</MouseOverPopover> : <MouseOverPopover text={I18N.get('上一页')} sx={noDrag}>
						<IconButton size="large" edge="start" color="inherit" aria-label="homepage" sx={{
							mr: 2
						}} onClick={event => {
							router.back();
						}}>
							<ArrowBack />
						</IconButton>
					</MouseOverPopover>}
				</nav>
				<Typography variant="h6" component="div" sx={{
					flexGrow: 1
				}} style={{
					textAlign: "center"
				}}>
					{props.isIndex ? "NeilaTools" : props.pageName}
				</Typography>
				<showSidebar.Consumer>
					{value => !props.isIndex && (
						<IconButton onClick={event => {
							value.set((!stringToBoolean(value.show)).toString() as stringifyCheck);
						}} size="large" edge="end" color="inherit" aria-label="menu" sx={{
							mr: 2
						}}>
							{value.show === "false" ? <ArrowForward /> : <ArrowBackIos />}
						</IconButton>
					)}
				</showSidebar.Consumer>
				<nav>
					<Link href="/setting/option" className={style["link"]} style={noDrag}>
						<MouseOverPopover text={I18N.get('设置')}>
							<IconButton size="large" edge="end" color="inherit" aria-label="menu" sx={{
								mr: 2
							}}>
								<SettingsIcon />
							</IconButton>
						</MouseOverPopover>
					</Link>
				</nav>
			</Toolbar>
		</AppBar>
		{stringToBoolean(forkMeOnGithub.value) ? <div className={style["github-ribbon"]} style={{
			...noDrag,
			...props.isIndex ? {
				left: "0px"
			} : {
				right: "0px"
			}
		}}>
			<a href="https://github.com/neila-a/NeilaTools.git" style={props.isIndex ? {
				transform: "rotate(-45deg)",
				left: "-40px"
			} : {
				transform: "rotate(45deg)",
				right: "-40px"
			}}>Fork me on GitHub</a>
		</div> : <Fragment />}
		<Toolbar />
	</>;
};
