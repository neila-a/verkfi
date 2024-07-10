import {
    FolderDelete
} from "@mui/icons-material";
import {
    IconButton
} from "@mui/material";
import MouseOverPopover from "@verkfi/shared/Popover";
import {
    get
} from "react-intl-universal";
import {
    globalList,
    homeList,
    sortingForAtom,
    toolsAtom
} from "index/atoms";
import {
    startTransition,
    useContext
} from "react";
import {
    useAtom,
    useAtomValue,
    useSetAtom
} from "jotai";
import {
    isImplantContext
} from "index/consts";
import {
    globalProps
} from "../../consts";
import {
    listsAtom
} from "@verkfi/shared/atoms";
function sortingIsString(sorting: any): sorting is string {
    return sorting !== globalList && sorting !== homeList;
}
export default function SingleToolDeleteFromCategoryButton(props: Pick<globalProps, "tool">) {
    const isImplant = useContext(isImplantContext),
        sortingFor = useAtomValue(sortingForAtom)(isImplant),
        [lists, setLists] = useAtom(listsAtom),
        setTools = useSetAtom(toolsAtom);
    return sortingIsString(sortingFor) && <MouseOverPopover text={get("singleTool.deleteFromCategory")}>
        <IconButton onClick={event => {
            startTransition(async () => {
                const newLists = structuredClone(lists);
                newLists.set(sortingFor, newLists.get(sortingFor).filter((singleTool: string) => singleTool !== props.tool.to));
                await setLists(newLists);
                return await setTools(`remove ${props.tool.to}`);
            });
        }} aria-label={get("singleTool.deleteFromCategory")}>
            <FolderDelete />
        </IconButton>
    </MouseOverPopover>;
}
