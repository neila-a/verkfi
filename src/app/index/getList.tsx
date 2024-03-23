"use client";
import {
    lists
} from './Sidebar';
import useReadSetting from '../setting/useReadSetting';
const useList = () => {
    const defaultList: lists = [],
        defaultListJSON = JSON.stringify(defaultList),
        realListJSON = useReadSetting("lists", defaultListJSON),
        lists = realListJSON || defaultListJSON;
    return JSON.parse(lists) as lists;
};
export default useList;