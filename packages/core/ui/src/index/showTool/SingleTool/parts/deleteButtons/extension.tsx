import {
    createElement,
    startTransition,
    useState
} from "react";
import {
    globalProps
} from "../../consts";
import {
    NXTMetadata
} from "setting/extensions/page";
import MouseOverPopover from "@verkfi/shared/Popover";
import {
    get
} from "react-intl-universal";
import {
    IconButton
} from "@mui/material";
import {
    Delete
} from "@mui/icons-material";
import {
    useSetAtom
} from "jotai";
import {
    toolsAtom
} from "index/atoms";
import RemoveExtensionDialog from "setting/extensions/RemoveExtensionDialog";
export default function SingleToolDeleteFromExtensionButton(props: Pick<globalProps, "tool">) {
    /**
     * 只有这里用得上removeDialog
     */
    const [removeDialogOpen, setRemoveDialogOpen] = useState(false),
        setTools = useSetAtom(toolsAtom);
    return props.tool.to.startsWith("/tools/extension") && <>
        <MouseOverPopover text={get("singleTool.deleteExtension")} key="tuple">
            <IconButton onClick={(event: any) => {
                setRemoveDialogOpen(true);
            }} aria-label={get("singleTool.deleteExtension")}>
                <Delete />
            </IconButton>
        </MouseOverPopover>
        <RemoveExtensionDialog files={[]} open={removeDialogOpen} reset={() => setRemoveDialogOpen(true)} fileInfo={{
            ...props.tool,
            to: props.tool.to.replace("/tools/extension?tool=", "") as Lowercase<string>,
            settings: [],
            main: ""
        } as unknown as NXTMetadata} onTrue={() => startTransition(() => setTools(`remove ${props.tool.to}`))} />
    </>;
}
