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
} from '../tools/extended/db';
const convertExtendedTools: (extendedTools: single[]) => tool[] = extendedTools => extendedTools?.map(single => ({
    name: single.name,
    to: `/tools/extended?tool=${single.to}` as Lowercase<string>,
    desc: single.desc,
    icon: () => <Image src={`/extendedfiles/${single.to}/${single.icon}`} alt={single.name} height={24} width={24} />,
    color: single.color as [Hex.Hex, Hex.Hex],
    isGoto: true
}));
export default convertExtendedTools;
