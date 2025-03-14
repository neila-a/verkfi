"use client";
import {
    Box,
    Drawer,
    FormControlLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
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
import {
    Outlet,
    useLocation,
    useNavigate
} from "react-router";
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
/**
 * 1 === 100%
 */
const allWidth = 100;
export default function Settings() {
    const sets = useAtomValue(setsAtom),
        navigate = useNavigate(),
        [extensionTools, setExtensions] = useAtom(extensionsAtom),
        {
            pathname
        } = useLocation(),
        id = pathname.split("/").slice(-1)?.[0] || "",
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
                        ml: sidebarMode === "sidebar" && showSidebar && `${drawerWidth}px` || "",
                        boxSizing: "border-box"
                    }
                }}>
                    <Toolbar />
                    <Tabs sx={{
                        [`& .MuiTab-root`]: {
                            maxWidth: `${allWidth / sets.length}%`,
                            width: `${allWidth / sets.length}%`,
                            minWidth: `${allWidth / sets.length}%`
                        }
                    }} scrollButtons allowScrollButtonsMobile value={value} onChange={(event, newValue) => {
                        setValue(newValue);
                    }}>
                        {sets.map(Set => <Tab icon={<Set.Icon />} onClick={event => {
                            navigate(`/setting/${Set.id}`);
                        }} title={`/setting/${Set.id}`} iconPosition="start" label={Set.name} key={Set.id} />)}
                    </Tabs>
                </Drawer>
                <Toolbar />
            </nav>
            <Box component="article" sx={{
                flexGrow: 1,
                p: 3
            }}>
                <ErrorBoundary>
                    <Suspense fallback={<Loading>
                        SettingsLayout
                    </Loading>}>
                        <Outlet />
                    </Suspense>
                </ErrorBoundary>
                <Box sx={{
                    mt: 2
                }}>
                    {extensionTools.map(item => item.settings.filter(settingItem => settingItem.page === id).map((settingItem, index) => {
                        const publicProps = {
                            value: settingItem.value as string,
                            label: settingItem.text,
                            onChange: (event: {
                                target: {
                                    value: boolean | string;
                                }
                            }) => {
                                const modifiedSettings = structuredClone(item.settings);
                                modifiedSettings[index].value = event.target.value;
                                setExtensions({
                                    ...item,
                                    settings: modifiedSettings
                                });
                            }
                        };
                        switch (settingItem.type) {
                            case "boolean":
                                return <FormControlLabel control={(
                                    <Switch checked={settingItem.value as boolean} onChange={event => {
                                        const modifiedSettings = structuredClone(item.settings);
                                        modifiedSettings[index].value = !(modifiedSettings[index].value as boolean);
                                        setExtensions({
                                            ...item,
                                            settings: modifiedSettings
                                        });
                                    }} />
                                )} label={settingItem.text} />;
                            case "input":
                                return <TextField {...publicProps} variant="outlined" />;
                            case "switch":
                                return <Select {...publicProps}>
                                    {settingItem.switches.map(switching => <MenuItem key={switching} value={switching}>
                                        {switching}
                                    </MenuItem>)}
                                </Select>;
                        }
                    }))}
                </Box>
            </Box>
        </>
    );
}
