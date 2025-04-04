import { Box, Button, Typography } from "@mui/material"
import { useSession, signIn } from "next-auth/react"
import GoogleIcon from '@mui/icons-material/Google';


export default function Component() {
  const { data: session } = useSession();


  if(!session)
  return (
    <Box sx={{ minHeight : "500px" , display : "flex" , flexDirection : "column" , justifyContent  : "center" , alignItems : "center" , gap : "30px"}}>
      <Typography variant="h4" >Happy Chatting</Typography>
      <Box>
        <Typography variant="body1" sx={{ textAlign : "center"}} >Chat with your parents , love , friends , customers ... </Typography>
        <Typography variant="body1" sx={{ textAlign : "center"}} >Explore new friends </Typography>
        <Typography variant="body1" sx={{ textAlign : "center"}} >Sign in and start chatting </Typography>
      </Box>
      <Button variant="contained" onClick={() => signIn()} sx={{ display : "flex" , gap : "10px"}} > <GoogleIcon/><Typography>Sign In With google</Typography> </Button>
    </Box>
  )
}