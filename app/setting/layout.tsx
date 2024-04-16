"use client";
import {
	get
} from 'react-intl-universal';
import {
	Box,
	Drawer,
	FormControlLabel,
	MenuItem,
	Select,
	Switch,
	Tab,
	Tabs,
	TextField,
	Toolbar
} from "@mui/material";
import HeadBar from "components/HeadBar";
import {
	ReactNode,
	useContext,
	useState
} from "react";
import {
	Settings as SettingsIcon,
	Info as InfoIcon,
	Extension as ExtensionIcon,
	Palette as PaletteIcon
} from "@mui/icons-material";
import type VerkfiIcon from 'components/verkfiIcon/verkfiIcon';
import {
	drawerWidth
} from './consts';
export type settingPage = "option" | "about" | "extensions" | "theme";
export interface set {
	name: string;
	id: settingPage;
	Icon: typeof VerkfiIcon;
}
export interface ThemeHaveZIndex {
	zIndex: {
		drawer: number;
	}
}
import ErrorBoundary from 'components/ErrorBoundary';
import {
	useRouter,
	useSelectedLayoutSegment
} from 'next/navigation';
import {
	extensions,
	showSidebar as showSidebarContext,
	sidebarMode as sidebarModeContext
} from 'layout/layoutClient';
import {
	useLiveQuery
} from 'dexie-react-hooks';
import db, {
	single
} from 'db';
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
			name: get('extensions.扩展'),
			id: "extensions",
			Icon: ExtensionIcon
		},
		{
			name: get("主题"),
			id: "theme",
			Icon: PaletteIcon
		}
	],
		router = useRouter(),
		usedExtensions = useContext(extensions),
		extensionTools = usedExtensions.value,
		id = useSelectedLayoutSegment(),
		[value, setValue] = useState(sets.indexOf(sets.filter(set => set.id === id)[0])),
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
						ml: sidebarMode.value === "sidebar" && showSidebar.show && `${drawerWidth}px`,
						boxSizing: 'border-box'
					},
				}}>
					<Toolbar />
					<Tabs sx={{
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
				<Box sx={{
					mt: 2
				}}>
					{extensionTools.map(item => item.settings.filter(settingItem => settingItem.page === id).map((settingItem, index) => {
						switch (settingItem.type) {
							case "boolean":
								return (
									<FormControlLabel control={(
										<Switch checked={settingItem.value as boolean} onChange={event => {
											const modifiedSettings = item.settings.slice(0);
											modifiedSettings[index].value = !(modifiedSettings[index].value as boolean);
											usedExtensions.set({
												...item,
												settings: modifiedSettings
											});
										}} />
									)} label={settingItem.text} />
								);
							case "input":
								return (
									<TextField value={settingItem.value as string} label={settingItem.text} variant="outlined" onChange={event => {
										const modifiedSettings = item.settings.slice(0);
										modifiedSettings[index].value = event.target.value;
										usedExtensions.set({
											...item,
											settings: modifiedSettings
										});
									}} />
								);
							case "switch":
								return (
									<Select value={settingItem.value as string} label={settingItem.text} onChange={event => {
										const modifiedSettings = item.settings.slice(0);
										modifiedSettings[index].value = event.target.value;
										usedExtensions.set({
											...item,
											settings: modifiedSettings
										});
									}}>
										{settingItem.switches.map(switching => (
											<MenuItem key={switching} value={switching}>{switching}</MenuItem>
										))}
									</Select>
								);
						}
					}))}
				</Box>
			</Box>
		</>
	);
};
