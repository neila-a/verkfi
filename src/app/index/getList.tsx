"use client";
import {
    lists
} from './Sidebar';
import useReadSetting from '../setting/useReadSetting';
const useList = () => {
    const defaultList: lists = [],
        realList = useReadSetting("lists", defaultList);
    return realList || defaultList;
};
export default useList;