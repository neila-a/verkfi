import HeadBar, {
    HeadBarOption
} from "../../components/HeadBar";
import Center from "../../components/Center";
export function AboutContent(props: {
    icon: () => JSX.Element;
    content: string;
}): JSX.Element {
    return (
        <Center></Center>
    );
};
export default function AboutIndex(): JSX.Element {
    const options: HeadBarOption = {
        aboutTo: "",
        isIndex: false,
        pageName: "关于此站点"
    };
    return (
        <>
            <HeadBar {...options} />
            <AboutContent icon={}/>
        </>
    );
};