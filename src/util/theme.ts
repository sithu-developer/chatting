import { createTheme } from "@mui/material";

export const theme = createTheme({
    palette : {
        primary : {
            main : "#101821" ,            
        },
        secondary : {
            main : "#1D2D41"
        },
        text : {
            primary : "#fff",
            secondary : "#F5F5F5"
        },
        
    } ,
    typography : {
         fontFamily : "system-ui",
        // fontFamily : "cursive",
        // fontFamily : "Itim"
    }
})