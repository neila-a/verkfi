"use client";
import I18N from 'react-intl-universal';
import {
	AppBar,
	Toolbar,
	IconButton,
	Typography,
	FormGroup,
	FormControl
} from "@mui/material";
import {
	useRouter
} from 'next/navigation'
import ErrorBoundary from "../ErrorBoundary";
import {
	ArrowBack,
	Settings as SettingsIcon,
	Search as SearchIcon,
	LightMode,
	DarkMode
} from "@mui/icons-material"
import {
	CSSProperties,
	Fragment,
	useState
} from "react";
import style from "./HeadBar.module.scss";
import LpLogger from "lp-logger";
import MouseOverPopover from "../Popover";
import {
	Theme
} from "@emotion/react";
import stringToBoolean from "../../setting/stringToBoolean";
import dynamic from 'next/dynamic';
const PureDialog = dynamic(() => import("../dialog/PureDialog"));
const Index = dynamic(() => import("../../page"));
var logger = new LpLogger({
	name: "HeadBar",
	level: "log", // 空字符串时，不显示任何信息
});
import {
	SxProps
} from '@mui/material/styles';
import Search from "./search";
import SearchIconWrapper from "./SearchIconWrapper";
import StyledInputBase from "./StyledInputBase";
import Link from 'next/link';
import checkOption from '../../setting/checkOption';
import setOption from '../../setting/setOption';
export interface HeadBarOption {
	pageName: string;
	isIndex?: boolean;
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
	const {
		isIndex = false
	} = props;
	var [forkMeOnGitHub, setForkMeOnGithub] = useState(() => {
		const option = checkOption("fork-me-on-github", "Fork me on GitHub", "false");
		return option || "false"
	}),
		[darkMode, setDarkMode] = useState<boolean>(() => {
			const mode = checkOption("darkmode", "暗色模式", "false");
			return stringToBoolean(mode) || false;
		}),
		[searchText, setSearchText] = useState(""),
		[showSearchTool, setShowSearchTool] = useState<boolean>(false),
		router = useRouter();
	const noDrag: CSSProperties = {
		// @ts-ignore React的CSSProperties中明明有WebkitAppRegion，但是类型中没有
		WebkitAppRegion: "no-drag",
	};
	return props.only ? <Fragment /> : <>
		<AppBar position="sticky" sx={{
			WebkitAppRegion: "drag",
			...props.sx
		}}>
			<Toolbar>
				<nav>
					{props.isIndex ? <MouseOverPopover text={I18N.get("暗色模式")}>
						<IconButton size='large' edge="start" color="inherit" aria-label="darkmode" sx={{
							mr: 2
						}} onClick={event => {
							setOption("darkmode", "暗色模式", !darkMode);
						}}>
							{!darkMode ? <DarkMode /> : <LightMode />}
						</IconButton>
					</MouseOverPopover> : <MouseOverPopover text={I18N.get('首页')} sx={noDrag}>
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
				{props.isIndex != true && <form style={noDrag} onSubmit={event => {
					event.preventDefault();
					setShowSearchTool(true);
				}}>
					<FormGroup>
						<FormControl>
							<Search>
								<SearchIconWrapper>
									<SearchIcon />
								</SearchIconWrapper>
								<StyledInputBase name="searchText" placeholder={I18N.get('搜索工具……')} onChange={event => {
									setSearchText(event.target.value);
								}} inputProps={{
									'aria-label': 'search'
								}} value={searchText} />
							</Search>
						</FormControl>
					</FormGroup>
				</form>}
				<nav>
					<Link href="/setting/option" className={style["link"]} style={noDrag}>
						<MouseOverPopover text={I18N.get('设置')}>
							<IconButton size="large" edge="end" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
								<SettingsIcon />
							</IconButton>
						</MouseOverPopover>
					</Link>
				</nav>
			</Toolbar>
		</AppBar>
		{stringToBoolean(forkMeOnGitHub) ? <div className={style["github-ribbon"]} style={{
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
		{showSearchTool && <PureDialog title={I18N.get('搜索工具')} onClose={() => {
			setSearchText("");
			setShowSearchTool(false);
		}}>
			<ErrorBoundary>
				<Index isImplant>
					{searchText}
				</Index>
			</ErrorBoundary>
		</PureDialog>}
	</>;
};
