import {
    TextField
} from "@mui/material";
import {
    get
} from "react-intl-universal";
import {
    NXTMetadata
} from "./page";
import {
    useAtom
} from "jotai";
import {
    fileInfoAtom
} from "./atoms";
function InfoInput(props: {
    id: string;
    name: string;
}) {
    const [info, setInfo] = useAtom(fileInfoAtom);
    return <TextField key={props.id} margin="dense" value={info[props.id]} onChange={event => setInfo(old => {
        const bufferInfo: NXTMetadata = JSON.parse(JSON.stringify(old));
        bufferInfo[props.id] = event.target.value;
        return bufferInfo;
    })} label={get(props.name)} variant="outlined" />;
}
export default InfoInput;
