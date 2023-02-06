import HeadBar from "../../components/HeadBar";
import LpLogger from "lp-logger";
export var logger = new LpLogger({
    name: "KeyCode",
    level: "log", // 空字符串时，不显示任何信息
});
export default function KeyCode(): JSX.Element {
    return (
        <>
            <HeadBar isIndex={false} pageName="按键编码" />
        </>
    );
};