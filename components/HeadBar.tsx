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
import eruda from "eruda";
export var logger = new LpLogger({
    name: "HeadBar",
    level: "log", // 空字符串时，不显示任何信息
});
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
		switch (window.localStorage.getItem("fork-me-on-github")) {
			case "true":
				logger.log("检测到\"Fork me on GitHub\"为开启状态。");
				break;
			case "false":
				setForkMeOnGitHub(false);
				logger.log("检测到\"Fork me on GitHub\"为关闭状态。");
				break;
			default:
				window.localStorage.setItem("fork-me-on-github", "true");
				logger.log("检测到\"Fork me on GitHub\"为空，已设置为开启状态。");
				break;
		}
		switch (window.localStorage.getItem("eruda-enabled")) {
			case "true":
				setErudaEnabled(true);
				eruda.init();
				logger.log("检测到Eruda为启用状态，已初始化。");
				break;
			case "false":
				logger.log("检测到Eruda为关闭状态。");
				break;
			default:
				window.localStorage.setItem("eruda-enabled", "false");
				logger.log("检测到Eruda为空，已设置为关闭状态。");
				break;
		};
	}, [setForkMeOnGitHub, setErudaEnabled]);
	return (
		<>
			<Head>
				<link rel="shortcut icon" href="/favicon.ico" />
				<title>{props.pageName}</title>
			</Head>
			<AppBar position="static">
				<Toolbar>{props.isIndex ? <></> :
					<IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={() => {
						Router.push("/");
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
		</>
	);
};
