"use client";
import {
    useEffect,
    useState
} from "react";
import {
    message
} from "../../service-worker/onMessage";
import toolsInfoAtom, {
    tool
} from "tools/info";
import {
    Provider,
    useAtom,
    useAtomValue
} from "jotai";
import {
    convertedExtensionsAtom
} from "@verkfi/shared/atoms/extensions";
import {
    get
} from "react-intl-universal";
import {
    ArrowBackIos as ArrowBackIosIcon,
    Article,
    Home,
    TrendingFlat,
    Search as SearchIcon,
    Close,
    Sync
} from "@mui/icons-material";
import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    InputAdornment,
    type SvgIcon,
    TextField,
    useMediaQuery,
    useTheme
} from "@mui/material";
import {
    hex
} from "declare";
import Hex = hex.Hex;
import ToolsStack from "index/showTool";
import setsAtom from "setting/setsAtom";
import MouseOverPopover from "@verkfi/shared/Popover";
import isBrowser from "@verkfi/shared/isBrowser";
import InputDialog from "@verkfi/shared/dialog/Input";
import {
    showClientsAtom
} from "@verkfi/shared/atoms";
import Transition from "@verkfi/shared/dialog/Transition";
import {
    clientsAtom
} from "./atoms";
import No from "@verkfi/shared/No";
export default function Clients() {
    const [clients, setClients] = useAtom(clientsAtom),
        realTools = useAtomValue(toolsInfoAtom),
        theme = useTheme(),
        [control, setControl] = useAtom(showClientsAtom),
        sets = useAtomValue(setsAtom),
        fullScreen = useMediaQuery(theme.breakpoints.down("sm")),
        emptyColor = new Array<string>(2).fill(theme.palette.background.paper) as [Hex, Hex],
        [navigateDialogOpen, setNavigateDialogOpen] = useState(false),
        [navigatingId, setNavigatingId] = useState(""),
        [searchText, setSearchText] = useState(""),
        converted = useAtomValue(convertedExtensionsAtom),
        filteredClients = clients.filter(client => client.url.includes(searchText));
    let focusing = "";
    if (isBrowser()) {
        focusing = window.location.pathname;
    }
    function refresh() {
        const channel = new MessageChannel();
        channel.port1.onmessage = event => {
            setClients(event.data);
        };
        if ("serviceWorker" in navigator && navigator.serviceWorker) {
            navigator.serviceWorker.controller.postMessage({
                action: "getClients"
            } as message, [channel.port2]);
        }
    }
    useEffect(refresh, []);
    return (
        <Dialog fullScreen={fullScreen} onClose={() => {
            setControl(false);
        }} sx={{
            ".MuiDialog-paper": {
                maxWidth: "unset"
            },
            zIndex: "38601"
        }} open={control} TransitionComponent={Transition}>
            <DialogTitle sx={{
                m: 0,
                p: 0,
                display: "flex",
                alignItems: "center"
            }}>
                <TextField slotProps={{
                    input: {
                        startAdornment:
                            <InputAdornment position="end">
                                {searchText !== ""
                                    && <MouseOverPopover text={get("back")}>
                                        <IconButton type="button" aria-label={get("back")} onClick={() => {
                                            setSearchText("");
                                        }}>
                                            <ArrowBackIosIcon />
                                        </IconButton>
                                    </MouseOverPopover>
                                }
                                <MouseOverPopover text={get("搜索")}>
                                    <IconButton type="button" aria-label={get("搜索")}>
                                        <SearchIcon />
                                    </IconButton>
                                </MouseOverPopover>
                            </InputAdornment>,
                        endAdornment:
                            <InputAdornment position="start">
                                <MouseOverPopover text={get("clients.sync")}>
                                    <IconButton aria-label={get("clients.sync")} onClick={refresh}>
                                        <Sync />
                                    </IconButton>
                                </MouseOverPopover>
                                <MouseOverPopover text={get("close")}>
                                    <IconButton aria-label={get("close")} onClick={event => {
                                        setControl(false);
                                    }}>
                                        <Close />
                                    </IconButton>
                                </MouseOverPopover>
                            </InputAdornment>

                    },
                    htmlInput: {
                        "aria-label": get("clients.search")
                    }
                }} fullWidth autoFocus value={searchText} sx={{
                    flex: 1
                }} placeholder={get("clients.search")} onChange={event => {
                    setSearchText(event.target.value);
                }} />
            </DialogTitle>
            <DialogContent dividers>
                <Provider>
                    <ToolsStack notfound={(
                        <No>
                            {get("clients.notfound")}
                            <br />
                            <Button sx={{
                                cursor: "pointer",
                                textTransform: "none" // 路径变为大写会出现错误，因为路径是大小写敏感的
                            }} onClick={event => {
                                window.open(searchText).focus();
                            }}>
                                {get("clients.openNew", {
                                    path: searchText
                                })}
                            </Button>
                        </No>
                    )} disableClick focus={focusing} actions={filteredClients.map(client => <MouseOverPopover key={client.id} text={get("clients.navigate")}>
                        <IconButton aria-label={get("clients.navigate")} onClick={event => {
                            setNavigatingId(client.id);
                            setNavigateDialogOpen(true);
                        }}>
                            <TrendingFlat />
                        </IconButton>
                    </MouseOverPopover>
                    )} paramTool={filteredClients.map(client => {
                        const url = new URL(client.url);
                        let tool: tool;
                        if (url.pathname === "/") {
                            tool = {
                                name: get("主页"),
                                to: url.pathname as Lowercase<string>,
                                desc: "", // 将会被覆盖
                                color: emptyColor,
                                icon: Home as typeof SvgIcon
                            };
                        } else if (url.pathname.startsWith("/tools")) {
                            let to = url.pathname.replace("/tools/", "");
                            if (to.startsWith("extension")) {
                                to = url.searchParams.get("tool");
                            }
                            tool = realTools.find(single => single.to === to)
                                || converted.find(single => `/tools/extension?tool=${to}` === single.to);
                            tool = {
                                ...tool
                            };
                            if (tool?.to) {
                                tool.to = url.pathname as Lowercase<string>;
                            }
                        } else if (url.pathname.startsWith("/setting")) {
                            const found = sets.find(set => set.id === url.pathname.replace("/setting/", ""));
                            if (found) {
                                tool = {
                                    name: found.name + get("设置"),
                                    icon: found.Icon as typeof SvgIcon,
                                    to: url.pathname as Lowercase<string>,
                                    desc: "", // 将会被覆盖
                                    color: emptyColor
                                };
                            }
                        }
                        if (!tool) {
                            tool = {
                                name: url.pathname,
                                icon: Article as typeof SvgIcon,
                                to: url.pathname as Lowercase<string>,
                                desc: "", // 将会被覆盖
                                color: emptyColor
                            };
                        }
                        tool.desc = `ID: ${client.id}`;
                        return tool;
                    })} />
                </Provider>
            </DialogContent>
            <InputDialog label={get("clients.navigate")} context={get("clients.navigateInput")} onDone={context => {
                const channel = new MessageChannel();
                channel.port1.onmessage = event => {
                    setClients(event.data);
                    setNavigatingId("");
                    setNavigateDialogOpen(false);
                };
                if ("serviceWorker" in navigator && navigator.serviceWorker) {
                    navigator.serviceWorker.controller.postMessage({
                        action: "navigate",
                        id: navigatingId,
                        url: context
                    } as message, [channel.port2]);
                }
            }} inputAdd={{
                placeholder: "/"
            }} sx={{
                zIndex: "38602"
            }} onCancel={() => {
                setNavigatingId("");
                setNavigateDialogOpen(false);
            }} title={get("clients.navigate")} open={navigateDialogOpen} />
        </Dialog>
    );
}
