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
import HeadBar from "../components/headBar/HeadBar";
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
	id: string;
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
import { ErrorBar } from 'victory';
import ErrorBoundary from '../components/ErrorBoundary';
export default function Settings(): JSX.Element {
	var [context, setContext] = useState<string>("option");
	const sets: set[] = [
		{
			name: I18N.get('选项'),
			id: "option",
			Component: Options,
			Icon: SettingsIcon
		},
		{
			name: I18N.get('关于'),
			id: "about",
			Component: About,
			Icon: InfoIcon
		},
		{
			name: I18N.get('重置'),
			id: "reset",
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
							<ListItem key={Set.id} onClick={event => {
								setContext(Set.id);
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
				<ErrorBoundary>
					{sets.map(set => {
						if (set.id == context) return (
							<Fragment key={set.name}>
								<Typography variant="h4">{set.name}</Typography>
								<set.Component />
							</Fragment>
						);
						return <Fragment key={set.name} />;
					})}
				</ErrorBoundary>
			</Box>
		</>
	);
};
