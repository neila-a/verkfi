import {
    globalProps
} from "../../consts";
import SingleToolDeleteFromCategoryButton from "./category";
import SingleToolDeleteFromExtensionButton from "./extension";
export default function SingleToolDeleteButtons(props: Pick<globalProps, "tool">) {
    return <>
        <SingleToolDeleteFromExtensionButton {...props} />
        <SingleToolDeleteFromCategoryButton {...props} />
    </>;
}
