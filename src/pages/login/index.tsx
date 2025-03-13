import { Box, Button, Typography } from "@mui/material"
import { useSession, signIn, signOut } from "next-auth/react"
import GoogleIcon from '@mui/icons-material/Google';
import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { createUser } from "@/store/slices/userSlice";
import { useRouter } from "next/router";

export default function Component() {
  const { data: session } = useSession()
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  useEffect(() => {
    if (session && session.user && session.user.email) {
        const email = String(session.user.email);
        dispatch(createUser({ email , isSuccess : () => {
            router.push("/login/chats")
    } }));
    }
  } , [ session ])

  if(!session)
  return (
    <Box sx={{ minHeight : "500px" , display : "flex" , flexDirection : "column" , justifyContent  : "center" , alignItems : "center" , gap : "30px"}}>
      <Typography variant="h4" >Happy Chating</Typography>
      <Box>
        <Typography variant="body1" sx={{ textAlign : "center"}} >Chat with your parents , love , friends , customers ... </Typography>
        <Typography variant="body1" sx={{ textAlign : "center"}} >Explore new friends </Typography>
        <Typography variant="body1" sx={{ textAlign : "center"}} >Sign in and start chating </Typography>
      </Box>
      <Button variant="contained" onClick={() => signIn()} sx={{ display : "flex" , gap : "10px"}} > <GoogleIcon/><Typography>Sign In With google</Typography> </Button>
    </Box>
  )
}