import { Alert, Backdrop, Box, CircularProgress, Snackbar } from "@mui/material"
import { ReactNode } from "react";
import TopBar from "./TopBar";
import SideBar from "./SideBar";
import { useState } from "react";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { changeStatus, createUser } from "@/store/slices/userSlice";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Status } from "@/types/user";
import { changeSnackBar } from "@/store/slices/generalSlice";


interface Props {
    children : ReactNode;
}

const Layout = ( { children } : Props) => {
     const [ open , setOpen ] = useState<boolean>(false);
     const snackBar = useAppSelector(store => store.general.snackBar);
     const isLoading = useAppSelector(store => store.general.isLoading);
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

     useEffect(() => {
        if( navigator !== undefined && navigator.onLine ) {
            dispatch(changeStatus(Status.online));
        } else {
            dispatch(changeStatus(Status.offline));
        }
        return () => {
            dispatch(changeStatus(Status.offline));
        }
     } , [ ])

    const handleCloseSnackBar = () => {
        dispatch(changeSnackBar({...snackBar , isSnackBarOpen : false}));
    }

    


    return (
        <Box>
            <TopBar open={open} setOpen={setOpen} />
            <Box>
                {children}
            </Box>
            <SideBar open={open} setOpen={setOpen} />
            <Snackbar open={snackBar.isSnackBarOpen} autoHideDuration={6000} onClose={handleCloseSnackBar} anchorOrigin={{horizontal : "center" , vertical : "bottom"}} >
                <Alert
                  onClose={handleCloseSnackBar}
                  severity={snackBar.severity}
                  variant="filled"
                  sx={{ width: "fit-content" }}
                >
                  {snackBar.message}
                </Alert>
            </Snackbar>
            <Backdrop
              sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
              open={isLoading}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
        </Box>
    )
}

export default Layout;