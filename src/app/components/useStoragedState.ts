import {
    useReducer
} from "react";
import setSetting from "../setting/setSetting";
import useReadSetting from "../setting/useReadSetting";
export default function useStoragedState<T = any>(id: string, name: string, empty: T) {
    const value = useReadSetting(id, empty);
    return useReducer((old: T, val: T) => {
        setSetting(id, name, val);
        return val;
    }, value);
}