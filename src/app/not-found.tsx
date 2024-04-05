"use client";
import {
    useRouter
} from "next/navigation";
import {
    default as ErrorElement
} from "./error";
export default function NotFound() {
    const router = useRouter();
    return (
        <ErrorElement reset={() => {
            router.push("/");
        }} error={new Error("HTTP Error 404")} />
    );
}