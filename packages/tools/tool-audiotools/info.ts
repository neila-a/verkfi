import {
    Audiotrack
} from "@mui/icons-material";
import {
    doubleHexTuple
} from "declare";
import {
    tool
} from "tools/info";
export default {
    name: "AudioTools",
    desc: "录音、复读",
    icon: Audiotrack,
    color: doubleHexTuple("84fab0", "8fd3f4")
} as tool;