"use client";
import {
    NXTMetadata
} from "setting/extensions/page";
import {
    type SvgIcon
} from "@mui/material";
import {
    tool
} from "tools/info";
const convertExtensionTools = (extensionTools: NXTMetadata[]) => extensionTools?.map(single => ({
    name: single.name,
    to: `/tools/extension?tool=${single.to}` as Lowercase<string>,
    desc: single.desc,
    /**
     * 这里的图片是直接从indexedDB加载来的，不需要且不能使用next/image的优化
     */
    icon: (() => (
        <img src={`/extensionfiles/${single.to}/${single.icon}`} alt={single.name} height={24} width={24} />
    )) as unknown as typeof SvgIcon,
    color: single.color,
    isGoto: true
} as tool));
export default convertExtensionTools;
