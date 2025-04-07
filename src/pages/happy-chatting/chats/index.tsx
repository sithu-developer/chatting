import { Box, Button, Divider, Typography } from "@mui/material";
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded';
import PushPinRoundedIcon from '@mui/icons-material/PushPinRounded';

const ChatsPage = () => {

    return (
        <Box sx={{ bgcolor : "primary.main" , height : "95vh"}}>
            <Box sx={{ height : "80px" , display : "flex" , alignItems : "center" , p : "5px" , px : "10px" ,  gap : "10px"}} >
                <Box sx={{ bgcolor : "info.main" , display : "flex" , justifyContent : "center" , alignItems : "center" , height : "55px" , width : "55px" , borderRadius : "30px" }} >
                    <BookmarkBorderRoundedIcon sx={{ fontSize : "35px" , color : "white"}} />
                </Box>
                <Box sx={{ display : "flex" , flexDirection : "column" , flexGrow : 1 }} >
                    <Box sx={{ display : "flex" , justifyContent : "space-between" , alignItems : "center" }} >
                        <Typography sx={{ color : "text.primary" }} >Saved Messages</Typography>
                        <Typography sx={{ color : "GrayText"}} >9:00 PM</Typography>
                    </Box>
                    <Box sx={{ display : "flex" , justifyContent : "space-between" , alignItems : "center" }} >
                        <Typography sx={{ color : "GrayText"}} >Lorem .......</Typography>
                        <Box sx={{ border : "1px solid gray" , width : "25px" , height : "25px" , borderRadius : "25px" , display : "flex" , justifyContent : "center" , alignItems : "center"}} >
                            <PushPinRoundedIcon sx={{ color : "GrayText" , fontSize : "16px" , rotate : "revert" , transform : "rotate(45deg)" }} />
                        </Box>
                    </Box>
                    <Divider sx={{ bgcolor : "GrayText" , mt : "13px"}} />
                </Box> 
            </Box>
        </Box>
    )
}

// here

export default ChatsPage;