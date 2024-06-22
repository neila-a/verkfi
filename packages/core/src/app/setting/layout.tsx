"use client";
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
import ErrorBoundary from "@verkfi/shared/ErrorBoundary";
import HeadBar from "@verkfi/shared/HeadBar";
import {
    showSidebarAtom as showSidebarAtom,
    sidebarModeAtom as sidebarModeAtom
} from "@verkfi/shared/atoms";
import extensionsAtom from "@verkfi/shared/atoms/extensions";
import {
    type default as VerkfiIcon
} from "@verkfi/shared/verkfiIcon";
import {
    useAtom,
    useAtomValue
} from "jotai";
import Loading from "loading";
import {
    Route
} from "next";
import {
    useRouter,
    useSelectedLayoutSegment
} from "next/navigation";
import {
    ReactNode,
    Suspense,
    useState
} from "react";
import {
    get
} from "react-intl-universal";
import {
    drawerWidth
} from "./consts";
import setsAtom from "./setsAtom";
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
    children: ReactNode;
}): JSX.Element {
    const sets = useAtomValue(setsAtom),
        router = useRouter(),
        [extensionTools, setExtensions] = useAtom(extensionsAtom),
        id = useSelectedLayoutSegment(),
        [value, setValue] = useState(sets.indexOf(sets.filter(set => set.id === id)[0])),
        showSidebar = useAtomValue(showSidebarAtom),
        sidebarMode = useAtomValue(sidebarModeAtom);
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
                        {sets.map(Set => <Tab icon={<Set.Icon />} title={`/setting/${Set.id}`} iconPosition="start" label={Set.name} key={Set.id} onClick={event => {
                            router.push(`/setting/${Set.id}` satisfies Route);
                        }} />
                        )}
                    </Tabs>
                </Drawer>
                <Toolbar />
            </nav>
            <Box component="article" sx={{
                flexGrow: 1,
                p: 3
            }}>
                <ErrorBoundary>
                    <Suspense fallback={<Loading />}>
                        {props.children}
                    </Suspense>
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
                                        {settingItem.switches.map(switching => <MenuItem key={switching} value={switching}>
                                            {switching}
                                        </MenuItem>
                                        )}
                                    </Select>
                                );
                        }
                    }))}
                </Box>
            </Box>
        </>
    );
}
