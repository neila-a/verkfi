import {
    useAtom,
    useAtomValue
} from "jotai";
import {
    useNavigate
} from "react-router-dom";
import {
    get
} from "react-intl-universal";
import CheckDialog from "@verkfi/shared/dialog/Check";
import atoms from "../atoms";
export default function SingleToolJumpDialog() {
    const navigate = useNavigate(),
        jump = useAtomValue(atoms.jump),
        [jumpDialogOpen, setJumpDialogOpen] = useAtom(atoms.dialogOpen.jump);
    return <CheckDialog open={jumpDialogOpen} description={get("singleTool.jump", {
        ...jump
    })} title={get("离开Verkfi")} onTrue={() => {
        navigate(jump.to);
        setJumpDialogOpen(false);
    }} onFalse={() => {
        setJumpDialogOpen(false);
    }} />;
}
