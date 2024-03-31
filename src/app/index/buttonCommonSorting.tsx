"use client";
import {
    tool
} from "../tools/info";
import setSetting from "../setting/setSetting";
import {
    lists
} from './Sidebar';
import useList from "./getList";
export default function useButtonCommonSorting() {
    const realList = useList();
    return (sortingFor: string, pd: tool[]) => {
        const index = realList.findIndex(item => item[0] === sortingFor),
            newRealList: lists = realList.slice(0);
        if (index === -1) {
            newRealList.push(["__global__", pd.map(toolp => toolp.to)])
        } else {
            newRealList[index][1] = pd.map(toolp => toolp.to);
        }
        setSetting("lists", "集合列表", newRealList);
    };
}
