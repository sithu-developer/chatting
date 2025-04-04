import { useRouter } from "next/router";
import { useEffect } from "react";

const HappyChatting = () => {
    const router = useRouter();

    useEffect(() => {
        router.push("/happy-chatting/login");
    } , []);

    return (
        <>Happy Chatting</>
    )
}

export default HappyChatting;