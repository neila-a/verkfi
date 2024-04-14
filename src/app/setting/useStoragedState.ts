"use client";
import {
    useReducer
} from "react";
import setSetting from "setting/setSetting";
import settingReader from "setting/settingReader";
import useSWR from "swr";
import {
    option
} from "db";
export default function useStoragedState<T = any>(id: string, name: string, empty: T) {
    const promise = settingReader(id, empty),
        {
            data: value
        } = useSWR(id, () => promise, {
            suspense: true,
            fallback: {
                [id]: {
                    key: id,
                    value: empty
                } as option<T>
            }
        }),
        reduce = useReducer((old: T, val: T) => {
            setSetting(id, name, val);
            return val;
        }, value.value);
    return reduce;
}