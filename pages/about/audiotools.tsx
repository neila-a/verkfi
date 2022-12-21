import HeadBar, {
    HeadBarOption
} from "../../components/HeadBar";
import {
    AboutContent
} from ".";
import {
    Audiotrack as AudiotrackIcon
} from "@mui/icons-material";
export default function About(): JSX.Element {
    const options: HeadBarOption = {
        aboutTo: "",
        pageName: "关于音频工具",
        isIndex: false
    };
    return (
        <>
            <HeadBar {...options} />
            <AboutContent icon={() => <AudiotrackIcon />} />
        </>
    );
};