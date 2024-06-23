import {
    TextField
} from "@mui/material";
import {
    setState
} from "declare";
import {
    get
} from "react-intl-universal";
import {
    NXTMetadata
} from "./page";
const InfoInput = (props: {
    id: string;
    name: string;
    info: NXTMetadata;
    setInfo: setState<NXTMetadata>;
}) => <TextField key={props.id} margin="dense" value={props.info[props.id]} onChange={event => props.setInfo(old => {
    const bufferInfo: NXTMetadata = JSON.parse(JSON.stringify(old));
    bufferInfo[props.id] = event.target.value;
    return bufferInfo;
})} label={get(props.name)} variant="outlined" />;
export default InfoInput;
