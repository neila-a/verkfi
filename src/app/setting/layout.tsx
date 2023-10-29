"use client";
import {
    get
} from 'react-intl-universal';
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
	useContext,
	useState
} from "react";
import {
	Handyman as HandyManIcon,
	Settings as SettingsIcon,
	Info as InfoIcon,
	Replay as ReplayIcon,
	Extension as ExtensionIcon,
	Palette as PaletteIcon
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
	useRouter,
	useSelectedLayoutSegment
} from 'next/navigation';
import {
	showSidebar as showSidebarContext,
	sidebarMode as sidebarModeContext
} from '../layoutClient';
import stringToBoolean from './stringToBoolean';
export default function Settings(props: {
	children: ReactNode
}): JSX.Element {
	const sets: set[] = [
		{
			name: get('选项'),
			id: "option",
			Icon: SettingsIcon
		},
		{
			name: get('关于'),
			id: "about",
			Icon: InfoIcon
		},
		{
			name: get('重置'),
			id: "reset",
			Icon: ReplayIcon
		},
		{
			name: get('扩展'),
			id: "extendeds",
			Icon: ExtensionIcon
		},
		{
			name: get("主题"),
			id: "theme",
			Icon: PaletteIcon
		}
	],
		router = useRouter(),
		id = useSelectedLayoutSegment();
	const [value, setValue] = useState(sets.indexOf(sets.filter(set => set.id === id)[0])),
		showSidebar = useContext(showSidebarContext),
		sidebarMode = useContext(sidebarModeContext);
	return (
		<>
			<HeadBar isIndex={false} pageName={get('设置')} sx={{
				zIndex: theme => (theme as ThemeHaveZIndex).zIndex.drawer + 1
			}} />
			<nav>
				<Drawer anchor="top" variant="permanent" sx={{
					flexShrink: 0,
					[`& .MuiDrawer-paper`]: {
						ml: stringToBoolean(showSidebar.show) && `${drawerWidth}px`,
						boxSizing: 'border-box'
					},
				}}>
					<Toolbar />
					<Tabs sx={{
						width: (sidebarMode.value === "sidebar") ? `calc(100% - ${drawerWidth}px)` : "100%",
						[`& .MuiTab-root`]: {
							maxWidth: `${100 / sets.length}%`,
							width: `${100 / sets.length}%`,
							minWidth: `${100 / sets.length}%`
						}
					}} scrollButtons allowScrollButtonsMobile value={value} onChange={(event, newValue) => {
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
			<Box component="article" sx={{
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
