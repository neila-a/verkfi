import HeadBar, {
    HeadBarOption
} from "../../components/HeadBar";
import {
    AboutContent
} from ".";
import {
    Filter as FilterIcon
} from "@mui/icons-material";
export default function About(): JSX.Element {
    const options: HeadBarOption = {
        aboutTo: "",
        pageName: "关于滤镜",
        isIndex: false
    };
    return (
        <>
            <HeadBar {...options} />
            <AboutContent icon={() => <FilterIcon />} />
        </>
    );
};