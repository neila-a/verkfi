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
	Search as SearchIcon
} from "@mui/icons-material"
import Head from "next/head";
import {
	Fragment,
	useState
} from "react";
import style from "./HeadBar.module.scss";
import LpLogger from "lp-logger";
import MouseOverPopover from "../Popover";
import {
	Theme
} from "@emotion/react";
import {
	Index as SearchTool
} from "../../page";
import stringToBoolean from "../../setting/stringToBoolean";
import PureDialog from "../dialog/PureDialog";
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
 */
export default function HeadBar(props: HeadBarOption): JSX.Element {
	var [forkMeOnGitHub, setForkMeOnGithub] = useState(() => {
		const option = checkOption("fork-me-on-github", "Fork me on GitHub", "false");
		return option || "false"
	}),
		[searchText, setSearchText] = useState(""),
		[showSearchTool, setShowSearchTool] = useState<boolean>(false),
		router = useRouter();
	return (
		<>
			<Head>
				<link rel="shortcut icon" href="/image/favicon.ico" />
				<title>{props.pageName}</title>
			</Head>
			{props.only ? <Fragment /> : <>
				<AppBar position="sticky" sx={props.sx}>
					<Toolbar>
						{props.isIndex ? <Fragment /> : <MouseOverPopover text={I18N.get('首页')}>
							<IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{
								mr: 2
							}} onClick={event => {
								router.back();
							}}>
								<ArrowBack />
							</IconButton>
						</MouseOverPopover>}
						<Typography variant="h6" component="div" sx={{
							flexGrow: 1
						}} style={{
							textAlign: "center"
						}}>
							{props.isIndex ? "NeilaTools" : props.pageName}
						</Typography>
						{props.isIndex != true && <form onSubmit={event => {
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
						<Link href="/setting" className={style["link"]}>
							<MouseOverPopover text={I18N.get('设置')}>
								<IconButton size="large" edge="end" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
									<SettingsIcon />
								</IconButton>
							</MouseOverPopover>
						</Link>
					</Toolbar>
				</AppBar>
				{stringToBoolean(forkMeOnGitHub) ? <div className={style["github-ribbon"]} style={props.isIndex ? {
					left: "0px"
				} : {
					right: "0px"
				}}>
					<a href="https://github.com/neila-a/NeilaTools.git" style={props.isIndex ? {
						transform: "rotate(-45deg)",
						left: "-40px"
					} : {
						transform: "rotate(45deg)",
						right: "-40px"
					}}>Fork me on GitHub</a>
				</div> : <Fragment />}
			</>}
			{showSearchTool && <PureDialog title={I18N.get('搜索工具')} onClose={() => {
				setSearchText("");
				setShowSearchTool(false);
			}} context={<ErrorBoundary>
				<SearchTool isImplant searchText={searchText} />
			</ErrorBoundary>} />}
		</>
	);
};
