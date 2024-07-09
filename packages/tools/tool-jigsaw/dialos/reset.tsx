"use client";
import CheckDialog from "@verkfi/shared/dialog/Check";
import {
    get
} from "react-intl-universal";
import {
    useAtom,
    useSetAtom
} from "jotai";
import atoms from "../atoms";
import SplitInputs from "../SplitInputs";
export default function ResetDialog() {
    const [resetDialogOpen, setResetDialogOpen] = useAtom(atoms.dialogOpen.reset),
        start = useSetAtom(atoms.jigsaws.starter);
    return <CheckDialog sx={{
        zIndex: "38602"
    }} insert={<SplitInputs />} open={resetDialogOpen} onFalse={() => {
        setResetDialogOpen(false);
    }} title={get("jigsaw.reset")} description={get("jigsaw.resetDescription")} onTrue={async () => {
        start();
        setResetDialogOpen(false);
    }} />;
}
