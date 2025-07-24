import { Box, Button, Fade, Slide, Typography, Zoom } from "@mui/material"
import { useSession, signIn } from "next-auth/react"
import GoogleIcon from '@mui/icons-material/Google';
import Image from "next/image";


export default function Component() {
  const { data: session } = useSession();


  if(!session)
  return (
    <Box sx={{ background: "linear-gradient(to right,  #1D2D41, #371d3fff, #540466ff)" , height : "calc(100vh - 56px)" , overflowY : "hidden" , display : "flex" , flexDirection : "column" , justifyContent  : "center" , alignItems : "center" , gap : "30px" , position :"relative" }}>
      <Slide direction="down" in timeout={{ enter : 1000}} >
        <Typography variant="h4" sx={{ color : "white"}} >Happy Chatting</Typography>
      </Slide>
      <Fade in timeout={{ enter : 3000}}>
        <Image alt="Chat logo" src={"/Chat-Logo.png"} width={300} height={300} style={{ width : "200px" , height :"auto" , position : "absolute" , top : "80px" , left : "50%" , transform: "translateX(-50%)"}} />
      </Fade>
      <Slide direction="left" in timeout={{ enter : 1000}} >
        <Box>
          <Typography variant="body1" sx={{ textAlign : "center" , color : "white"}} >Chat with your parents , love , friends , customers ... </Typography>
          <Typography variant="body1" sx={{ textAlign : "center" , color : "white"}} >Explore new friends </Typography>
          <Typography variant="body1" sx={{ textAlign : "center" , color : "white"}} >Sign in and start chatting </Typography>
        </Box>
      </Slide>
      <Zoom in timeout={{ enter : 1000}}>
        <Button variant="contained" color="info" onClick={() => signIn()} sx={{ display : "flex" , gap : "10px" }} > <GoogleIcon sx={{ color : "black"}}/><Typography sx={{ color : "black" , fontWeight : "500"}}>Sign In With google</Typography> </Button>
      </Zoom>
    </Box>
  )
}