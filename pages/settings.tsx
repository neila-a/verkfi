import {
	FormGroup,
	FormControlLabel,
	Switch,
	Typography,
	Box,
	Drawer,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Toolbar
} from "@mui/material";
import Link from "next/link";
import pack from "../package.json";
import HeadBar from "../components/HeadBar";
import {
	useState,
	useEffect,
	Fragment
} from "react";
import LpLogger from "lp-logger";
export var logger = new LpLogger({
	name: "Settings",
	level: "log", // 空字符串时，不显示任何信息
});
import React from "react";
import style from "../styles/Settings.module.scss";
import {
	Handyman as HandyManIcon,
	Settings as SettingsIcon,
	Info as InfoIcon
} from "@mui/icons-material";
import { setOption, stringToBoolean, useReadSetting } from "../components/useSetting";
export const drawerWidth = 240;
export interface set {
	name: string;
	Component: () => JSX.Element;
	Icon: typeof HandyManIcon;
}
interface ThemeHaveZIndex {
	zIndex: {
		drawer: number;
	}
}
export default function Settings(): JSX.Element {
	function About() {
		return (
			<div>
				<div className={style["title"]}>
					<HandyManIcon sx={{
						fontSize: "3.75rem"
					}} />
					<Typography variant="h2">NeilaTools</Typography>
				</div>
				<Typography>
					发行版本：{pack.version}
					<br />
					内部版本：{pack.devVersion}
					<br />
					©Copyleft ! 2022-2023， Neila。
					<br />
					本程序从未提供品质担保。
					<br />
					版权部分所有，遵循<Link href="http://gnu.org/licenses/gpl.html">GNU GPL 许可证第三版或者更新版本</Link>授权使用，欢迎你在满足一定条件后对其再发布。
				</Typography>
			</div>
		);
	}
	var forkMeOnGitHub = useReadSetting("fork-me-on-github", "Fork me on GitHub", String(false));
	const Options = () => {
		return (
			<FormGroup>
				<FormControlLabel control={
					<Switch checked={stringToBoolean(forkMeOnGitHub)} onChange={event => {
						setOption("fork-me-on-github", "Fork me on GitHub", event.target.checked)
					}} />
				} label="Fork Me On GitHub" />
			</FormGroup>
		);
	}
	var [context, setContext] = useState<string>("选项");
	const sets: set[] = [
		{
			name: "选项",
			Component: Options,
			Icon: SettingsIcon
		},
		{
			name: "关于",
			Component: About,
			Icon: InfoIcon
		}
	];
	return (
		<Box>
			<HeadBar isIndex={false} pageName="设置" sx={{
				zIndex: theme => (theme as ThemeHaveZIndex).zIndex.drawer + 1
			}} />
			<Drawer
				variant="permanent"
				sx={{
					width: drawerWidth,
					flexShrink: 0,
					[`& .MuiDrawer-paper`]: {
						boxSizing: 'border-box'
					},
				}}
			>
				<Toolbar />
				<Box sx={{
					overflow: 'auto'
				}}>
					<List>
						{sets.map((Set, index) => (
							<ListItem key={Set.name} onClick={event => {
								setContext(Set.name);
							}} disablePadding>
								<ListItemButton>
									<ListItemIcon>
										<Set.Icon />
									</ListItemIcon>
									<ListItemText primary={Set.name} />
								</ListItemButton>
							</ListItem>
						))}
					</List>
				</Box>
			</Drawer>
			<Box component="main" sx={{
				flexGrow: 1,
				p: 3,
				marginLeft: `${drawerWidth}px`
			}}>
				{sets.map(set => {
					if (set.name == context) return <set.Component key={set.name} />;
					return <Fragment key={set.name} />;
				})}
			</Box>
		</Box>
	);
};