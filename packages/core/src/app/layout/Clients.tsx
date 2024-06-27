"use client";
import {
    Suspense
} from "react";
import {
    useAtom,
    useSetAtom
} from "jotai";
import {
    get
} from "react-intl-universal";
import {
    ArrowBackIos as ArrowBackIosIcon,
    Search as SearchIcon,
    Close,
    Sync
} from "@mui/icons-material";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    InputAdornment,
    TextField,
    useMediaQuery,
    useTheme
} from "@mui/material";
import MouseOverPopover from "@verkfi/shared/Popover";
import {
    showClientsAtom
} from "@verkfi/shared/atoms";
import Transition from "@verkfi/shared/dialog/Transition";
import {
    clientsAtom,
    searchTextAtom
} from "./atoms";
import ClientsContent from "./ClientsContent";
import ToolsSkeleton from "index/showTool/toolsSkeleton";
export default function Clients() {
    const setClients = useSetAtom(clientsAtom),
        theme = useTheme(),
        [control, setControl] = useAtom(showClientsAtom),
        fullScreen = useMediaQuery(theme.breakpoints.down("sm")),
        [searchText, setSearchText] = useAtom(searchTextAtom);
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
                                    <IconButton aria-label={get("clients.sync")} onClick={event => setClients()}>
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
            <DialogContent dividers sx={{
                maxHeight: "100%"
            }}>
                <Suspense fallback={<ToolsSkeleton />}>
                    <ClientsContent />
                </Suspense>
            </DialogContent>
        </Dialog>
    );
}
