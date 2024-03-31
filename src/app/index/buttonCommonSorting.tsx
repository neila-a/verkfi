"use client";
import {
    tool
} from "../tools/info";
import setSetting from "../setting/setSetting";
import {
    lists as listsType
} from './Sidebar';
import {
    useContext
} from "react";
import {
    lists
} from "../layout/layoutClient";
export default function useButtonCommonSorting() {
    const usedLists = useContext(lists),
        realList = usedLists.value;
    return (sortingFor: string, pd: tool[]) => {
        const index = realList.findIndex(item => item[0] === sortingFor),
            newRealList: listsType = realList.slice(0);
        if (index === -1) {
            newRealList.push(["__global__", pd.map(toolp => toolp.to)])
        } else {
            newRealList[index][1] = pd.map(toolp => toolp.to);
        }
        usedLists.set(newRealList);
    };
}
