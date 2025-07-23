import { useRouter } from "next/router";
import { useEffect } from "react";

const HappyChatting = () => {
    const router = useRouter();

    useEffect(() => {
        if(router) {
            router.push("/happy-chatting/login");
        }
    } , [router]);

    return (
        <>Happy Chatting</>
    )
}

export default HappyChatting;