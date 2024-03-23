"use client";
import {
    tool
} from "../tools/info";
import setSetting from "../setting/setSetting";
import {
    lists
} from './Sidebar';
import useReadSetting from "../setting/useReadSetting";
export default function useButtonCommonSorting() {
    const defaultList: lists = [],
        realListJSON = useReadSetting("lists", JSON.stringify(defaultList)),
        realList = JSON.parse(realListJSON) as lists;
    return (sortingFor: string, pd: tool[]) => {
        if (sortingFor === "__global__") {
            setSetting("toolslist", "分类", JSON.stringify(pd.map(toolp => toolp.to)));
        } else {
            var newRealList: lists = realList;
            realList.forEach((item, index) => {
                if (sortingFor === item[0]) {
                    newRealList[index][1] = pd.map(toolp => toolp.to);
                }
            });
            setSetting("lists", "集合列表", JSON.stringify(newRealList));
        }
    };
}
