import setSetting from "./setSetting";
export default function setOption(id: string, name: string, value: boolean | string): boolean {
    setSetting(id, name, String(value));
    location.reload();
    return Boolean(value);
}