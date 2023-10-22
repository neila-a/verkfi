"use client";
import {
    tool
} from "../tools/info";
import setSetting from "../setting/setSetting";
import checkOption from '../setting/checkOption';
import {
    lists
} from './Sidebar';
export default function buttonCommonSorting(sortingFor: string, pd: tool[]) {
    if (sortingFor === "__global__") {
        setSetting("toolslist", "分类", JSON.stringify(pd.map(toolp => toolp.to)));
    } else {
        const defaultList: lists = [], realListJSON = checkOption("lists", "集合列表", JSON.stringify(defaultList)), realList = JSON.parse(realListJSON) as lists;
        var newRealList: lists = realList;
        realList.forEach((item, index) => {
            if (sortingFor === item[0]) {
                newRealList[index][1] = pd.map(toolp => toolp.to);
            }
        });
        setSetting("lists", "集合列表", JSON.stringify(newRealList));
    }
}
