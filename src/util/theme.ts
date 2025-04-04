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
            primary : "#FBF8EF",
            secondary : "#3487AB"
        }
    } ,
    typography : {
         fontFamily : "system-ui",
        // fontFamily : "cursive",
    }
})