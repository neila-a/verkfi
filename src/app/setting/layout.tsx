"use client";
import I18N from 'react-intl-universal';
import {
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
	ReactNode
} from "react";
import {
	Handyman as HandyManIcon,
	Settings as SettingsIcon,
	Info as InfoIcon,
	Replay as ReplayIcon,
	Extension as ExtensionIcon
} from "@mui/icons-material";
import {
	drawerWidth
} from './consts';
export interface set {
	name: string;
	id: string;
	Icon: typeof HandyManIcon;
}
export interface ThemeHaveZIndex {
	zIndex: {
		drawer: number;
	}
}
import ErrorBoundary from '../components/ErrorBoundary';
import {
	useRouter
} from 'next/navigation';
export default function Settings(props: {
	children: ReactNode
}): JSX.Element {
	const sets: set[] = [
		{
			name: I18N.get('选项'),
			id: "option",
			Icon: SettingsIcon
		},
		{
			name: I18N.get('关于'),
			id: "about",
			Icon: InfoIcon
		},
		{
			name: I18N.get('重置'),
			id: "reset",
			Icon: ReplayIcon
		},
		{
			name: I18N.get('扩展'),
			id: "extendeds",
			Icon: ExtensionIcon
		}
	],
		router = useRouter();
	return (
		<>
			<HeadBar isIndex={false} pageName={I18N.get('设置')} sx={{
				zIndex: theme => (theme as ThemeHaveZIndex).zIndex.drawer + 1
			}} />
			<nav>
				<Drawer variant="permanent" sx={{
					width: drawerWidth,
					flexShrink: 0,
					[`& .MuiDrawer-paper`]: {
						width: drawerWidth,
						boxSizing: 'border-box'
					},
				}}>
					<Toolbar />
					<Box sx={{
						overflow: 'auto'
					}} id="select">
						<List>
							{sets.map((Set, index) => (
								<ListItem key={Set.id} onClick={event => {
									router.push(`/setting/${Set.id}`);
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
			</nav>
			<Box component="main" sx={{
				flexGrow: 1,
				p: 3,
			}}>
				<ErrorBoundary>
					{props.children}
				</ErrorBoundary>
			</Box>
		</>
	);
};
