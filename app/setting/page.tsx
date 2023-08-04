"use client";
import I18N from 'react-intl-universal';
import {
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
import HeadBar from "../../components/HeadBar";
import {
	useState,
	Fragment
} from "react";
import LpLogger from "lp-logger";
export var logger = new LpLogger({
	name: "Settings",
	level: "log", // 空字符串时，不显示任何信息
});
import React from "react";
import {
	Handyman as HandyManIcon,
	Settings as SettingsIcon,
	Info as InfoIcon,
	Replay as ReplayIcon
} from "@mui/icons-material";
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
import Options from "./Options";
import Reset from "./Reset";
import About from "./About";
export default function Settings(): JSX.Element {
	var [context, setContext] = useState<string>(I18N.get("选项"));
	const sets: set[] = [
		{
			name: I18N.get('选项'),
			Component: Options,
			Icon: SettingsIcon
		},
		{
			name: I18N.get('关于'),
			Component: About,
			Icon: InfoIcon
		},
		{
			name: I18N.get('重置'),
			Component: Reset,
			Icon: ReplayIcon
		}
	];
	return (
		<>
			<HeadBar isIndex={false} pageName={I18N.get('设置')} sx={{
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
