"use client";
import I18N from 'react-intl-universal';
import {
	Box,
	Drawer,
	Tab,
	Tabs,
	Toolbar
} from "@mui/material";
import HeadBar from "../components/headBar/HeadBar";
import {
	ReactNode,
	useState
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
import Link from 'next/link';
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
	const [value, setValue] = useState(0);
	return (
		<>
			<HeadBar isIndex={false} pageName={I18N.get('设置')} sx={{
				zIndex: theme => (theme as ThemeHaveZIndex).zIndex.drawer + 1
			}} />
			<nav>
				<Drawer anchor="top" variant="permanent" sx={{
					flexShrink: 0,
					[`& .MuiDrawer-paper`]: {
						marginLeft: `${drawerWidth}px`,
						boxSizing: 'border-box'
					},
				}}>
					<Toolbar />
					<Tabs value={value} onChange={(event, newValue) => {
						setValue(newValue);
					}}>
						{sets.map(Set => (
							<Tab icon={<Set.Icon />} iconPosition="start" label={Set.name} key={Set.id} onClick={event => {
								router.push(`/setting/${Set.id}`);
							}} />
						))}
					</Tabs>
				</Drawer>
				<Toolbar />
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
