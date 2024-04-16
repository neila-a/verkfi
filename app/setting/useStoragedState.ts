"use client";
import {
    useReducer
} from "react";
import setSetting from "setting/setSetting";
import settingReader from "setting/settingReader";
import useSWR from "swr";
export default function useStoragedState<T = any>(id: string, name: string, empty: T) {
    const promise = settingReader(id, empty),
        reduce = useReducer((old: T, val: T) => {
            setSetting(id, name, val);
            return val;
        }, useSWR(id, () => promise, {
            suspense: true
        }).data);
    return reduce;
}