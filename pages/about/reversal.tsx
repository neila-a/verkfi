import HeadBar, {
    HeadBarOption
} from "../../components/HeadBar";
import {
    AboutContent
} from ".";
import {
    FlipCameraAndroid as FlipCameraAndroidIcon
} from "@mui/icons-material";
export default function About(): JSX.Element {
    const options: HeadBarOption = {
        aboutTo: "",
        pageName: "关于翻转",
        isIndex: false
    };
    return (
        <>
            <HeadBar {...options} />
            <AboutContent icon={() => } />
        </>
    );
};