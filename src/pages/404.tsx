import { I18N } from '@common/I18N';
import HeadBar from "../components/HeadBar";
export default function NotFound(): JSX.Element {
    return (
        <>
            <HeadBar isIndex={false} pageName={I18N.get('未找到页面')} />
        </>
    );
}