import {
    ButtonBase
} from "@mui/material";
import {
    useAtomValue
} from "jotai";
import {
    ScopeProvider
} from "jotai-scope";
import {
    viewModeAtom
} from "@verkfi/shared/atoms";
import {
    gridWidth,
    fullWidth,
    globalProps
} from "./consts";
import SingleToolInListMode from "./modes/list";
import SingleToolInGridMode from "./modes/grid";
import SingleToolJumpDialog from "./parts/jumpDialog";
import atoms from "./atoms";
import getToolHref from "./getToolHref";
import {
    Link
} from "react-router-dom";
export default function SingleTool(props: globalProps) {
    const viewMode = useAtomValue(viewModeAtom);
    return <Link to={getToolHref(props.tool)} style={{
        textDecoration: "none"
    }}>
        <ButtonBase key={props.tool.to} component="section" sx={{
            width: viewMode === "grid" ? gridWidth : fullWidth
        }}>
            <ScopeProvider atoms={[atoms.jump, atoms.dialogOpen.jump, atoms.elevation]}>
                {viewMode === "grid" ? <SingleToolInGridMode {...props} /> : <SingleToolInListMode {...props} />}
                <SingleToolJumpDialog />
            </ScopeProvider>
        </ButtonBase>
    </Link>;
}
