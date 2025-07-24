import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect } from "react";


export default function Home() {

  const router = useRouter();

  useEffect(() => {
      if(router) {
        router.push("/happy-chatting/login");
      }
  } , [router]);

  return (
    <Box sx={{ background: "linear-gradient(to right,  #1D2D41, #371d3fff, #540466ff)" , height : "calc(100vh - 56px)" , overflowY : "hidden" , display : "flex" , flexDirection : "column" , justifyContent  : "center" , alignItems : "center" , gap : "30px" , position :"relative" }}>
      <Typography sx={{ color : "white"}} variant="h5">Main Page</Typography>
    </Box>
  );
}
