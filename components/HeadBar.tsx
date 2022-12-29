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
import ForkMeOnGitHub from "fork-me-on-github";
import {
	useEffect,
	useState
} from "react";
import style from "../styles/HeadBar.module.scss";
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
	useEffect(function () {
		switch (window.localStorage.getItem("fork-me-on-github")) {
			case "true":
				setForkMeOnGitHub(true);
				break;
			case "false":
				setForkMeOnGitHub(false);
				break;
			default:
				window.localStorage.setItem("fork-me-on-github", "true");
		}
	}, [setForkMeOnGitHub]);
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
					}}>
						<SettingsIcon />
					</IconButton> : <></>}
				</Toolbar>
			</AppBar>
			{forkMeOnGitHub ? <div className={style["github-ribbon"]}>
				<a href="https://github.com/neila-a/NeilaTools.git">Fork me on GitHub</a>
			</div> : <></>}
		</>
	);
};
