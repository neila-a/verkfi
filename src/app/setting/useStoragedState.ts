"use client";
import {
    use,
    useReducer
} from "react";
import setSetting from "setting/setSetting";
import {
    settingReader
} from "setting/settingReader";
export default function useStoragedState<T = any>(id: string, name: string, empty: T) {
    const value = use(settingReader(id, empty)),
        reduce = useReducer((old: T, val: T) => {
        setSetting(id, name, val);
        return val;
    }, value.value);
    return reduce;
}