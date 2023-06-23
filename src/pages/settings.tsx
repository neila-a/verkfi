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
	Toolbar,
	Button
} from "@mui/material";
import Link from "next/link";
import pack from "../package.json";
import HeadBar from "../components/HeadBar";
import {
	VictoryPie
} from "victory";
import {
	useState,
	Fragment,
	useEffect
} from "react";
import LpLogger from "lp-logger";
var logger = new LpLogger({
	name: "Settings",
	level: "log", // 空字符串时，不显示任何信息
});
import React from "react";
import style from "../styles/Settings.module.scss";
import {
	Handyman as HandyManIcon,
	Settings as SettingsIcon,
	Info as InfoIcon,
	Replay as ReplayIcon
} from "@mui/icons-material";
import {
	setOption,
	stringToBoolean,
	useReadSetting
} from "../components/useSetting";
import {
	CheckDialog
} from "../components/Dialog";
export const drawerWidth = 122;
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
export function Options() {
	return (
		<FormGroup>
			<FormControlLabel control={
				<Switch checked={stringToBoolean(useReadSetting("fork-me-on-github", "Fork me on GitHub", String(false)))} onChange={event => {
					setOption("fork-me-on-github", "Fork me on GitHub", event.target.checked)
				}} />
			} label="Fork Me On GitHub" />
		</FormGroup>
	);
}
export const KB = 1024,
	MB = KB * KB;
export function getSettingsUsed() {
	let cache = 0;
	for (let key in localStorage) {
		if (localStorage.hasOwnProperty(key)) {
			cache += localStorage.getItem(key).length;
		}
	}
	return Number((cache / KB).toFixed(2));
}
export const getSettingsSur = () => 5120 - getSettingsUsed();
export function Reset() {
	var [dialogOpen, setDialogOpen] = useState<boolean>(false),
		[dialogContext, setDialogContext] = useState<string>(""),
		[dialogTitle, setDialogTitle] = useState<string>(""),
		[cacheUsed, setCacheUsed] = useState<number>(1),
		[cacheAll, setCacheAll] = useState<number>(2),
		[dialogOnDone, setDialogOnDone] = useState<() => any>(() => null);
	useEffect(() => {
		navigator.storage.estimate().then(estimate => {
			setCacheUsed(estimate.usage / MB);
			setCacheAll(estimate.quota / MB);
		})
	}, [])
	return (
		<>
			<VictoryPie height={256} width={256} colorScale={[
				"tomato",
				"orange"
			]} animate={{
				duration: 2000
			}} data={[
				{
					x: `缓存空间已使用容量：${cacheUsed.toFixed(5)}MB`,
					y: Number((cacheUsed / cacheAll * 100).toFixed(5))
				},
				{
					x: `缓存空间剩余容量：${(cacheAll - cacheUsed).toFixed(5)}MB`,
					y:  Number(((cacheAll - cacheUsed) / cacheAll * 100).toFixed(5))
				}
			]} />
			<Button variant="contained" onClick={event => {
				setDialogOpen(true);
				setDialogContext("确定清空所有缓存吗？此操作不可恢复。");
				setDialogTitle("清空");
				setDialogOnDone(() => () => caches.keys().then(keylist => Promise.all(keylist.map(key => {
					logger.log(`已删除缓存“${key}”`);
					return caches.delete(key);
				}))));
			}}>清空所有缓存</Button>
			<VictoryPie height={256} width={256} colorScale={[
				"tomato",
				"orange"
			]} animate={{
				duration: 2000
			}} data={[
				{
					x: `设置空间已使用容量：${getSettingsUsed()}KB`,
					y: getSettingsUsed() / 5120 * 100
				},
				{
					x: `设置空间剩余容量：${getSettingsSur()}KB`,
					y: getSettingsSur() / 5120 * 100
				}
			]} />
			<Button variant="contained" onClick={event => {
				setDialogOpen(true);
				setDialogContext("确定清空所有设置吗？此操作不可恢复。");
				setDialogTitle("清空");
				setDialogOnDone(() => () => localStorage.clear());
			}}>清空所有设置</Button>
			{dialogOpen && <CheckDialog title={dialogTitle} onFalse={() => {
				setDialogOpen(false);
			}} onTrue={() => {
				dialogOnDone();
				setDialogOpen(false);
			}} description={dialogContext} />}
		</>
	);
}
export function About() {
	return (
		<div>
			<div className={style["title"]}>
				<HandyManIcon sx={{
					fontSize: "2.125rem"
				}} />
				<Typography variant="h4" sx={{
					fontWeight: 300
				}}>NeilaTools</Typography>
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
				版权部分所有，遵循<Link href="http://gnu.org/licenses/agpl.html">GNU Affero通用公共许可证</Link>授权使用，欢迎你在满足一定条件后对其再发布。
			</Typography>
		</div>
	);
}
export default function Settings(): JSX.Element {
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
		},
		{
			name: "重置",
			Component: Reset,
			Icon: ReplayIcon
		}
	];
	return (
		<>
			<HeadBar isIndex={false} pageName="设置" sx={{
				zIndex: theme => (theme as ThemeHaveZIndex).zIndex.drawer + 1
			}} />
			<Drawer variant="permanent" sx={{
				width: drawerWidth,
				flexShrink: 0,
				[`& .MuiDrawer-paper`]: {
					width: drawerWidth,
					boxSizing: 'border-box'
				},
			}}
			>
				<Toolbar />
				<Box sx={{
					overflow: 'auto'
				}} id="select">
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
					if (set.name == context) return (
						<Fragment key={set.name}>
							<Typography variant="h4">{set.name}</Typography>
							<set.Component />
						</Fragment>
					);
					return <Fragment key={set.name} />;
				})}
			</Box>
		</>
	);
};