import {
    Typography
} from "@mui/material";
import {
	Handyman as HandyManIcon
} from "@mui/icons-material";
import Link from "next/link";
import style from "../styles/Settings.module.scss";
import {
	version,
	devVersion
} from "../../../package.json";
export default function About() {
    return (
        <div>
            <div className={style["title"]}>
                <HandyManIcon sx={{
                    fontSize: "2.125rem"
                }} />
                <Typography variant="h4" sx={{
                    fontWeight: 300
                }}>NeilaTools</Typography>
            </div>
            <Typography>
                发行版本：{version}
                <br />
                内部版本：{devVersion}
                <br />
                ©Copyleft ! 2022-2023， Neila。
                <br />
                本程序从未提供品质担保。
                <br />
                版权部分所有，遵循<Link href="http://gnu.org/licenses/agpl.html">GNU Affero通用公共许可证</Link>授权使用，欢迎你在满足一定条件后对其再发布。
            </Typography>
        </div>
    );
}