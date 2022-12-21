import HeadBar, {
    HeadBarOption
} from "../../components/HeadBar";
import {
    AboutContent
} from ".";
import {
    AccessTime as AccessTimeIcon
} from "@mui/icons-material";
export default function About(): JSX.Element {
    const options: HeadBarOption = {
        aboutTo: "",
        pageName: "关于大时间",
        isIndex: false
    };
    return (
        <>
            <HeadBar {...options} />
            <AboutContent icon={() => <AccessTimeIcon />} />
        </>
    );
};