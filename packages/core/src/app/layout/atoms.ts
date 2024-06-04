"use client";
import {
    atom
} from "jotai";
interface clientBase {
    id: string;
    url: string;
}
export const clientsAtom = atom<clientBase[]>([]);
