import HeadBar, {
    HeadBarOption
} from "../../components/HeadBar";
import {
    AboutContent
} from ".";
export default function About(): JSX.Element {
    const options: HeadBarOption = {
        aboutTo: "",
        pageName: "关于色子",
        isIndex: false
    };
    return (
        <>
            <HeadBar {...options} />
            <AboutContent />
        </>
    );
};