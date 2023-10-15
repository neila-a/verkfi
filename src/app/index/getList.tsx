"use client";
import checkOption from '../setting/checkOption';
import {
    lists
} from './Sidebar';
const getList = () => {
    const defaultList: lists = [], defaultListJSON = JSON.stringify(defaultList), realListJSON = checkOption("lists", "集合列表", defaultListJSON), lists = realListJSON || defaultListJSON;
    return JSON.parse(lists) as lists;
};
export default getList;