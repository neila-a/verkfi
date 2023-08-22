import I18N from 'react-intl-universal';
import {
    Typography
} from "@mui/material";
import {
	Handyman as HandyManIcon
} from "@mui/icons-material";
import style from "./Settings.module.scss";
import pack from "../../package.json";
import ErrorBoundary from '../components/ErrorBoundary';
const {
    version, devVersion
} = pack;
export default function About() {
    return (
        <ErrorBoundary>
            <div className={style["title"]}>
                <HandyManIcon sx={{
                    fontSize: "2.125rem"
                }} />
                <Typography variant="h4" sx={{
                    fontWeight: 300
                }}>NeilaTools</Typography>
            </div>
            <Typography>
                {I18N.get('发行版本：')}{version}
                <br />
                {I18N.get('内部版本：')}{devVersion}
                <br />
                ©Copyleft ! 2022-2023， Neila。
                <br />
                {I18N.get('本程序从未提供品质担保。')}
                <br />
                {I18N.getHTML('版权')}
            </Typography>
        </ErrorBoundary>
    );
}
