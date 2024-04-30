"use client";
import {
    useReducer
} from "react";
import setSetting from "setting/reader/setSetting";
import settingReader from "setting/reader/settingReader";
import useSWR from "swr";
export default function useStoragedState<setting = any>(id: string, name: string, empty: setting) {
    const promise = settingReader(id, empty),
        reduce = useReducer((old: setting, val: setting) => {
            setSetting(id, name, val);
            return val;
        }, useSWR(id, () => promise, {
            suspense: true
        }).data);
    return reduce;
}