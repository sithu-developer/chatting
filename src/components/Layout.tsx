import { Box } from "@mui/material"
import { ReactNode } from "react";
import TopBar from "./TopBar";
import SideBar from "./SideBar";
import { useState } from "react";
import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { createUser } from "@/store/slices/userSlice";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";


interface Props {
    children : ReactNode;
}

const Layout = ( { children } : Props) => {
     const [ open , setOpen ] = useState<boolean>(false);

     const { data: session } = useSession();
     const dispatch = useAppDispatch();
     const router = useRouter();
     const path = router.asPath;     

     
     useEffect(() => {
       if (session && session.user && session.user.email) {
           if(path === "/" || path === "/happy-chatting" || path === "/happy-chatting/login" ) {
                const email = String(session.user.email);
                dispatch(createUser({ email , isSuccess : () => {
                    router.push("/happy-chatting/chats")
                }}));
            } else {
                const email = String(session.user.email);
                dispatch(createUser({ email , isSuccess : () => {
                    router.push(router.asPath)
                }}));
            }
       }
     } , [ session ])

    return (
        <Box>
            <TopBar open={open} setOpen={setOpen} />
            <Box>
                {children}
            </Box>
            <button ></button>
            <SideBar open={open} setOpen={setOpen} />
        </Box>
    )
}

export default Layout;