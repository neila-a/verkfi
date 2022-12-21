import HeadBar, {
    HeadBarOption
} from "../../components/HeadBar";
import {
    AboutContent
} from ".";
export default function About(): JSX.Element {
    const options: HeadBarOption = {
        aboutTo: "",
        pageName: "关于π计算器",
        isIndex: false
    };
    return (
        <>
            <HeadBar {...options} />
            <AboutContent />
        </>
    );
};