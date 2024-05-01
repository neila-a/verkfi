"use client";
import {
    Extension as ExtensionIcon,
    Info as InfoIcon,
    Palette as PaletteIcon,
    Settings as SettingsIcon
} from "@mui/icons-material";
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
import ErrorBoundary from "components/ErrorBoundary";
import HeadBar from "components/HeadBar";
import {
    type default as VerkfiIcon
} from "components/verkfiIcon/verkfiIcon";
import {
    useAtom
} from "jotai";
import extensionsAtom from "layout/extensionsAtom";
import {
    showSidebar as showSidebarAtom,
    sidebarMode as sidebarModeAtom
} from "layout/layoutClient";
import {
    Route
} from "next";
import {
    useRouter,
    useSelectedLayoutSegment
} from "next/navigation";
import {
    ReactNode,
    useState
} from "react";
import {
    get
} from "react-intl-universal";
import {
    drawerWidth
} from "./consts";
export type settingPage = "option" | "about" | "extensions" | "appearance";
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
export default function Settings(props: {
	children: ReactNode
}): JSX.Element {
    const sets: set[] = [
        {
            name: get("选项"),
            id: "option",
            Icon: SettingsIcon
        },
        {
            name: get("关于"),
            id: "about",
            Icon: InfoIcon
        },
        {
            name: get("extensions.扩展"),
            id: "extensions",
            Icon: ExtensionIcon
        },
        {
            name: get("外观"),
            id: "appearance",
            Icon: PaletteIcon
        }
    ],
        router = useRouter(),
        [extensionTools, setExtensions] = useAtom(extensionsAtom),
        id = useSelectedLayoutSegment(),
        [value, setValue] = useState(sets.indexOf(sets.filter(set => set.id === id)[0])),
        [showSidebar] = useAtom(showSidebarAtom),
        [sidebarMode] = useAtom(sidebarModeAtom);
    return (
        <>
            <HeadBar isIndex={false} pageName={get("设置")} sx={{
                zIndex: theme => (theme as ThemeHaveZIndex).zIndex.drawer + 1
            }} />
            <nav>
                <Drawer anchor="top" variant="permanent" sx={{
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        ml: sidebarMode === "sidebar" && showSidebar && `${drawerWidth}px`,
                        boxSizing: "border-box"
                    }
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
                            <Tab icon={<Set.Icon />} title={`/setting/${Set.id}`} iconPosition="start" label={Set.name} key={Set.id} onClick={event => {
                                router.push(`/setting/${Set.id}` satisfies Route);
                            }} />
                        ))}
                    </Tabs>
                </Drawer>
                <Toolbar />
            </nav>
            <Box component="article" sx={{
                flexGrow: 1,
                p: 3
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
                                            setExtensions({
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
                                        setExtensions({
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
                                        setExtensions({
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
}
