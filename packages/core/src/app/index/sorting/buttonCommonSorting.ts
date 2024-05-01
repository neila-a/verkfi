"use client";
import {
    useAtom
} from "jotai";
import {
    lists
} from "layout/layoutClient";
import {
    type tool
} from "tools/info";
import {
    type lists as listsType
} from '../sidebar';
export default function useButtonCommonSorting() {
    const [realList, setList] = useAtom(lists);
    return (sortingFor: string, pd: tool[]) => {
        const index = realList.findIndex(item => item[0] === sortingFor),
            newRealList: listsType = realList.slice(0);
        if (index === -1) {
            newRealList.push(["__global__", pd.map(toolp => toolp.to)])
        } else {
            newRealList[index][1] = pd.map(toolp => toolp.to);
        }
        setList(newRealList);
    };
}
