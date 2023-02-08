// 重要：已废弃

import {
    Divider,
    Typography
} from '@mui/material';
import {
    GitHub as GitHubIcon,
    Handyman as HandymanIcon
} from "@mui/icons-material";
import style from "../styles/Footer.module.scss";
import Link from "next/link";
export interface link {
    name: string;
    to: string;
};
export const links: link[] = [
    {
        name: "主页",
        to: "/"
    }
];
export default function Footer(): JSX.Element {
    return (
        <footer className={style["cont"]}>
            <Divider light />
            <div className={style["top"]}>
                <Link href="/" className={style["logo"]}>
                    <a className={style["flex"]}>
                        <HandymanIcon />
                        <Typography variant="h6" gutterBottom>
                            NeilaTools
                        </Typography>
                    </a>
                </Link>
                <Typography variant="subtitle2" className={style["copyright"]} sx={{
                    lineHeight: 1
                }} gutterBottom>
                    Copyleft ! 2023，Neila。
                    版权部分所有，
                    遵循第三版GNU通用公共许可证授权使用。
                </Typography>
            </div>
            <div className={style["sec"]}>
                <ul className={style["links"]}>
                    {links.map(link => (
                        <li key={link.to}>
                            <a href={link.to} title={link.name} className={style["link"]}>
                                {link.name}
                            </a>
                        </li>
                    ))}
                    <div className={style["social"]}>
                        <a href="https://github.com/neila-a/NeilaTools" title="GitHub" className={style["linkColor"]}>
                            <GitHubIcon />
                        </a>
                    </div>
                </ul>
            </div>
        </footer>
    );
};