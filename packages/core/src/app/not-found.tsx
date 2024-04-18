"use client";
import {
    useRouter
} from "next/navigation";
import {
    default as ErrorElement
} from "error";
class NotFoundError extends Error {
    constructor(message = '404') {
        super(message);
        this.name = 'NotFoundError';
    }
}
export default function NotFound() {
    const router = useRouter();
    return (
        <ErrorElement reset={() => {
            router.push("/");
        }} error={new NotFoundError()} />
    );
}