"use client";
import {
    useRouter,
    useSearchParams
} from "next/navigation";
import Loading from "../loading";
export default function Handle() {
    const searchParams = useSearchParams(),
        router = useRouter();
    if (searchParams.has("handle")) {
        router.push(`/tools/${searchParams.get("handle").replace(/web\+neilatools:\/\//g, "")}`);
    }
    return <Loading />;
}