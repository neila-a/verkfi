import I18N from 'react-intl-universal';
import HeadBar from "./components/headBar/HeadBar";
export default function NotFound(): JSX.Element {
    return (
        <>
            <HeadBar isIndex={false} pageName={I18N.get('未找到页面')} />
        </>
    );
}
