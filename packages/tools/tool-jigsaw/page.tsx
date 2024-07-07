import Recents from "./recents";
import CreateJigsaw from "./CreateJigsaw";
import MainDialog from "./dialos";
import ResetDialog from "./dialos/reset";
export default function JigsawEntry() {
    return <>
        <CreateJigsaw />
        <Recents />
        <MainDialog />
        <ResetDialog />
    </>;
}
