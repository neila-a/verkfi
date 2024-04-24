"use client";
import {
    tool
} from "tools/info";
import {
    single
} from 'db';
const convertExtensionTools: (extensionTools: single[]) => tool[] = extensionTools => extensionTools?.map(single => ({
    name: single.name,
    to: `/tools/extension?tool=${single.to}` as Lowercase<string>,
    desc: single.desc,
    /**
     * 这里的图片是直接从indexedDB加载来的，不需要且不能使用next/image的优化
     */
    icon: () => <img src={`/extensionfiles/${single.to}/${single.icon}`} alt={single.name} height={24} width={24} />,
    color: single.color,
    isGoto: true
}));
export default convertExtensionTools;
