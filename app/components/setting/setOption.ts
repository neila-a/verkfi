import setSetting from "./setSetting";
export default function setOption(id: string, name: string, value: boolean) {
    setSetting(id, name, String(value));
    location.reload();
    return value;
}