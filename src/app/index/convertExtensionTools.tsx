"use client";
import {
    Hex
} from '../declare';
import {
    tool
} from "../tools/info";
import Image from 'next/image';
import {
    single
} from '../tools/extension/db';
const convertExtensionTools: (extensionTools: single[]) => tool[] = extensionTools => extensionTools?.map(single => ({
    name: single.name,
    to: `/tools/extension?tool=${single.to}` as Lowercase<string>,
    desc: single.desc,
    icon: () => <Image src={`/extensionfiles/${single.to}/${single.icon}`} alt={single.name} height={24} width={24} />,
    color: single.color as [Hex.Hex, Hex.Hex],
    isGoto: true
}));
export default convertExtensionTools;
