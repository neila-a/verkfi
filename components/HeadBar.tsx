import {
	AppBar,
	Toolbar,
	IconButton,
	Typography
} from "@mui/material";
import {
	ArrowBack,
	Settings as SettingsIcon
} from "@mui/icons-material"
import Router from "next/router";
import Head from "next/head";
import {
	useEffect,
	useState
} from "react";
import style from "../styles/HeadBar.module.scss";
import LpLogger from "lp-logger";
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
export interface HeadBarOption {
	pageName: string;
	isIndex: boolean;
};
/**
 * AppBar 的自定义封装。
 * @param {boolean} isIndex 是否是索引页面
 * @param {string} pageName 页面的名称
 */
export default function HeadBar(props: HeadBarOption): JSX.Element {
	var [forkMeOnGitHub, setForkMeOnGitHub] = useState<boolean>(true);
	var [erudaEnabled, setErudaEnabled] = useState<boolean>(false);
	useEffect(function () {
		setForkMeOnGitHub(stringToBoolean(checkOption("fork-me-on-github", "Fork me on GitHub", "false")));
	}, []);
	return (
		<header>
			<Head>
				<link rel="shortcut icon" href="/favicon.ico" />
				<title>{props.pageName}</title>
			</Head>
			<AppBar position="static">
				<Toolbar>{props.isIndex ? <></> :
					<IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={() => {
						Router.back();
						logger.log("已去往首页。");
					}}>
						<ArrowBack />
					</IconButton>}
					<Typography variant="h6" component="div" sx={{
						flexGrow: 1
					}} style={{
						textAlign: "center"
					}}>
						{props.isIndex ? "NeilaTools" : props.pageName}
					</Typography>
					{props.isIndex ? <IconButton size="large" edge="end" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={() => {
						Router.push("/settings");
						logger.log("已去往设置。");
					}}>
						<SettingsIcon />
					</IconButton> : <></>}
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
			</div> : <></>}
		</header>
	);
};
