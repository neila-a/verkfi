"use client";
import {
    Search as SearchIcon
} from "@mui/icons-material";
import {
    Box,
    Drawer,
    IconButton,
    InputAdornment,
    TextField,
    Toolbar
} from "@mui/material";
import MouseOverPopover from "@verkfi/shared/Popover";
import {
    useAtom,
    useAtomValue,
    useSetAtom
} from "jotai";
import {
    useContext,
    useState
} from "react";
import {
    get
} from "react-intl-universal";
import {
    drawerWidth
} from "setting/consts";
import Buttons from "./buttons";
import Selects from "./selects";
import SingleSelect from "./selects/SingleSelect";
import {
    expandAtom,
    globalList,
    homeList,
    listName,
    searchTextAtom,
    sorting,
    sortingForAtom,
    tabAtom,
    toolsAtom
} from "index/atoms";
import {
    isImplantContext
} from "index/consts";
export type lists = Map<listName, string[]>;
export default function Sidebar(props: {
    focusingTo: Lowercase<string>;
}) {
    const isImplant = useContext(isImplantContext),
        sortingFor = useAtomValue(sortingForAtom)(isImplant),
        setSortingFor = useSetAtom(sortingForAtom),
        [searchText, setSearchText] = useAtom(searchTextAtom),
        [clickCount, setClickCount] = useState(0),
        setTab = useSetAtom(tabAtom),
        setExpand = useSetAtom(expandAtom),
        tools = useAtomValue(toolsAtom);
    return (
        <Drawer variant="permanent" sx={{
            maxWidth: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
                maxWidth: drawerWidth,
                boxSizing: "border-box"
            }
        }}>
            <Toolbar />
            <TextField slotProps={{
                input: {
                    startAdornment:
                        <InputAdornment position="start">
                            <MouseOverPopover text={get("搜索")}>
                                <IconButton sx={{
                                    p: 0
                                }} type="button" aria-label={get("搜索")}>
                                    <SearchIcon />
                                </IconButton>
                            </MouseOverPopover>
                        </InputAdornment>
                },
                htmlInput: {
                    "aria-label": get("搜索工具")
                }
            }} value={searchText} onKeyDown={event => {
                if (event.key === "Tab" || event.key === "Enter") {
                    event.preventDefault();
                }
            }} onKeyUp={event => {
                if (event.key === "Tab") {
                    event.preventDefault();
                    setTab(old => (old + 1) % tools.length);
                } else if (event.key === "Enter") {
                    event.preventDefault();
                    const selectool = document.getElementById(`toolAbleToSelect-${props.focusingTo}`) as HTMLDivElement;
                    selectool?.click?.();
                }
            }} placeholder={get("搜索工具")} onChange={event => {
                setSearchText(event.target.value, isImplant);
                if (sortingFor === homeList) {
                    setSortingFor(globalList);
                }
            }} />
            <Box sx={{
                textAlign: "center"
            }}>
                {!isImplant && <SingleSelect
                    dragButton={<></>}
                    isSidebar
                    wantSortingFor={homeList}
                    tool={get("主页")}
                    onClick={event => {
                        setSortingFor(homeList);
                    }}
                    editButton={<></>}
                />}
                <Box onClick={() => {
                    setExpand(true);
                    if (clickCount === 1) {
                        setExpand(false);
                        setClickCount(0);
                    }
                }}>
                    <Selects
                        isSidebar
                        modifyClickCount={value => {
                            if (value === "++") {
                                setClickCount(old => old + 1);
                            } else {
                                setClickCount(value);
                            }
                        }}
                    />
                </Box>
            </Box>
            <Buttons />
        </Drawer>
    );
}
