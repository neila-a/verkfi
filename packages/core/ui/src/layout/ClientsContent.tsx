"use client";
import {
    useState
} from "react";
import {
    message
} from "@verkfi/core-service-worker/onMessage";
import toolsInfoAtom, {
    tool
} from "tools/info";
import {
    Provider, useAtomValue,
    useSetAtom
} from "jotai";
import {
    convertedExtensionsAtom
} from "@verkfi/shared/atoms/extensions";
import {
    get
} from "react-intl-universal";
import {
    Article,
    Home,
    TrendingFlat
} from "@mui/icons-material";
import {
    Button,
    IconButton,
    type SvgIcon,
    useTheme
} from "@mui/material";
import ToolsStackWithTools from "index/showTool";
import setsAtom from "setting/setsAtom";
import MouseOverPopover from "@verkfi/shared/Popover";
import isBrowser from "@verkfi/shared/isBrowser";
import InputDialog from "@verkfi/shared/dialog/Input";
import {
    clientsAtom,
    filteredClientsAtom,
    searchTextAtom
} from "./atoms";
import No from "@verkfi/shared/No";
import {
    hex
} from "declare";
import Hex = hex.Hex;
import {
    emptyNXTMetadata
} from "tools/extension/empties";
/**
 * 用于防止jotai引起的suspense
 */
export default function ClientsContent() {
    const searchText = useAtomValue(searchTextAtom),
        converted = useAtomValue(convertedExtensionsAtom),
        realTools = useAtomValue(toolsInfoAtom),
        sets = useAtomValue(setsAtom),
        [navigateDialogOpen, setNavigateDialogOpen] = useState(false),
        [navigatingId, setNavigatingId] = useState(""),
        theme = useTheme(),
        setClients = useSetAtom(clientsAtom),
        emptyColor = emptyNXTMetadata.color.fill(theme.palette.background.paper as Hex),
        filteredClients = useAtomValue(filteredClientsAtom);
    let focusing = "";
    if (isBrowser()) {
        focusing = window.location.pathname;
    }
    return <Provider>
        <ToolsStackWithTools disableClick focus={focusing} notfound={(
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
        )} actions={filteredClients.map(client => <MouseOverPopover key={client.id} text={get("clients.navigate")}>
            <IconButton aria-label={get("clients.navigate")} onClick={event => {
                setNavigatingId(client.id);
                setNavigateDialogOpen(true);
            }}>
                <TrendingFlat />
            </IconButton>
        </MouseOverPopover>)} paramTool={filteredClients.map(client => {
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
        <InputDialog label={get("clients.navigate")} context={get("clients.navigateInput")} onDone={context => {
            const channel = new MessageChannel();
            channel.port1.onmessage = event => {
                setClients();
                setNavigatingId("");
                setNavigateDialogOpen(false);
            };
            navigator?.serviceWorker?.controller?.postMessage?.({
                action: "navigate",
                id: navigatingId,
                url: context
            } as message, [channel.port2]);
        }} inputAdd={{
            placeholder: "/"
        }} sx={{
            zIndex: "38602"
        }} onCancel={() => {
            setNavigatingId("");
            setNavigateDialogOpen(false);
        }} title={get("clients.navigate")} open={navigateDialogOpen} />
    </Provider>;
}
