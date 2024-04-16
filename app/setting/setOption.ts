import setSetting from "./setSetting";
export default function setOption(id: string, name: string, value: boolean | string): never {
    setSetting(id, name, String(value));
    location.reload();
    throw {
        message: "Redirecting...",
        name: "setOption"
    };
}