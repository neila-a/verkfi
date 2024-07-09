import {
    useAtom,
    useAtomValue
} from "jotai";
import {
    Route
} from "next";
import dynamic from "next/dynamic";
import {
    useRouter
} from "next/navigation";
import {
    get
} from "react-intl-universal";
const CheckDialog = dynamic(() => import("@verkfi/shared/dialog/Check"));
import atoms from "../atoms";
export default function SingleToolJumpDialog() {
    const router = useRouter(),
        jump = useAtomValue(atoms.jump),
        [jumpDialogOpen, setJumpDialogOpen] = useAtom(atoms.dialogOpen.jump);
    return <CheckDialog open={jumpDialogOpen} description={get("singleTool.jump", {
        ...jump
    })} title={get("离开Verkfi")} onTrue={() => {
        router.push(jump.to as Route);
        setJumpDialogOpen(false);
    }} onFalse={() => {
        setJumpDialogOpen(false);
    }} />;
}
