import {
	AppBar,
	Toolbar,
	IconButton,
	Typography,
	InputBase,
	FormGroup,
	FormControl
} from "@mui/material";
import {
	ArrowBack,
	Settings as SettingsIcon,
	Search as SearchIcon
} from "@mui/icons-material"
import Router from "next/router";
import Head from "next/head";
import {
	useEffect,
	useState,
	Fragment
} from "react";
import {
	styled,
	alpha,
	SxProps
} from '@mui/material/styles';
import style from "../styles/HeadBar.module.scss";
import LpLogger from "lp-logger";
import MouseOverPopover from "./Popover";
import { Theme } from "@emotion/react";
export var logger = new LpLogger({
	name: "HeadBar",
	level: "log", // 空字符串时，不显示任何信息
});
export function checkOption(id: string, name: string, empty: string) {
	var _ret: string;
	const value = localStorage.getItem(id);
	switch (value) {
		case null:
			localStorage.setItem(id, "true");
			logger.log(`检测到“${name}”为空，已设置为${empty}。`);
			_ret = empty;
			break;
		default:
			logger.log(`检测到“${name}”为${value}。`);
			_ret = value;
			break;
	}
	return _ret;
};
export function stringToBoolean(string: string) {
	if (string == "false") string = "";
	return Boolean(string);
};
export const Search = styled('div')(({ theme }) => ({
	position: 'relative',
	borderRadius: theme.shape.borderRadius,
	backgroundColor: alpha(theme.palette.common.white, 0.15),
	'&:hover': {
		backgroundColor: alpha(theme.palette.common.white, 0.25),
	},
	marginLeft: 0,
	width: '100%',
	[theme.breakpoints.up('sm')]: {
		marginLeft: theme.spacing(1),
		width: 'auto',
	},
}));
export const SearchIconWrapper = styled('div')(({ theme }) => ({
	padding: theme.spacing(0, 2),
	height: '100%',
	position: 'absolute',
	pointerEvents: 'none',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
}));
export const StyledInputBase = styled(InputBase)(({ theme }) => ({
	color: 'inherit',
	'& .MuiInputBase-input': {
		padding: theme.spacing(1, 1, 1, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)})`,
		transition: theme.transitions.create('width'),
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			width: '12ch',
			'&:focus': {
				width: '20ch',
			},
		},
	},
}));
export interface HeadBarOption {
	pageName: string;
	isIndex: boolean;
	sx?: SxProps<Theme>;
};
/**
 * AppBar 的自定义封装。
 * @param {boolean} isIndex 是否是索引页面
 * @param {string} pageName 页面的名称
 */
export default function HeadBar(props: HeadBarOption): JSX.Element {
	var [forkMeOnGitHub, setForkMeOnGitHub] = useState<boolean>(false);
	useEffect(function () {
		setForkMeOnGitHub(stringToBoolean(checkOption("fork-me-on-github", "Fork me on GitHub", "false")));
	}, []);
	return (
		<header>
			<Head>
				<link rel="shortcut icon" href="/favicon.ico" />
				<title>{props.pageName}</title>
			</Head>
			<AppBar position="sticky" sx={props.sx}>
				<Toolbar>
					{props.isIndex ? <Fragment /> : <MouseOverPopover text="首页">
						<IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={() => {
							Router.push("/");
							logger.log("已去往首页。");
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
					{props.isIndex ? <MouseOverPopover text="设置">
						<IconButton size="large" edge="end" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={() => {
							Router.push("/settings");
							logger.log("已去往设置。");
						}}>
							<SettingsIcon />
						</IconButton>
					</MouseOverPopover> : <form action="/">
						<FormGroup>
							<FormControl>
								<Search>
									<SearchIconWrapper>
										<SearchIcon />
									</SearchIconWrapper>
									<StyledInputBase
										name="searchText"
										placeholder="搜索工具……"
										inputProps={{
											'aria-label': 'search'
										}}
									/>
								</Search>
							</FormControl>
						</FormGroup>
					</form>}
				</Toolbar>
			</AppBar>
			{forkMeOnGitHub ? <div className={style["github-ribbon"]} style={props.isIndex ? {
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
		</header>
	);
};
