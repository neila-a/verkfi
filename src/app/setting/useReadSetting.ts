import {
    useState,
    useEffect
} from "react";
import checkOption from "./checkOption";
export default function useReadSetting(id: string, name: string, empty: string) {
    const [set, setSet] = useState<string>(empty);
    useEffect(function () {
        setSet(checkOption(id, name, empty));
    }, []);
    return set;
}
