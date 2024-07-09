import {
    ButtonBase
} from "@mui/material";
import {
    Provider,
    useAtomValue
} from "jotai";
import {
    viewModeAtom
} from "@verkfi/shared/atoms";
import Link from "next/link";
import {
    gridWidth,
    fullWidth,
    globalProps
} from "./consts";
import SingleToolInListMode from "./modes/list";
import SingleToolInGridMode from "./modes/grid";
import SingleToolJumpDialog from "./parts/jumpDialog";
export default function SingleTool(props: globalProps) {
    const viewMode = useAtomValue(viewModeAtom);
    return <Link href="a" style={{
        textDecoration: "none"
    }}>
        <ButtonBase key={props.tool.to} component="section" sx={{
            width: viewMode === "grid" ? gridWidth : fullWidth
        }}>
            <Provider>
                {viewMode === "grid" ? <SingleToolInGridMode {...props} /> : <SingleToolInListMode {...props} />}
                <SingleToolJumpDialog />
            </Provider>
        </ButtonBase>
    </Link>;
}
