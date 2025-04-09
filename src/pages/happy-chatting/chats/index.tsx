import { Box, Button, Divider, Typography } from "@mui/material";
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded';
import PushPinRoundedIcon from '@mui/icons-material/PushPinRounded';
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import { User } from "@prisma/client";

const ChatsPage = () => {
    const friends = useAppSelector(store => store.userSlice.friends);
    const user = useAppSelector(store => store.userSlice.user) as User;
    const userIdAndFriendIds = useAppSelector(store => store.userIdAndFriendIdSlice.userIdAndFriendIds);
    const relationIdsOfFriendIds = userIdAndFriendIds.map(item => item.friendId);
    const relationIdsOfUserIds = userIdAndFriendIds.map(item => item.userId);
    const yourFriendIds = [...relationIdsOfFriendIds , ...relationIdsOfUserIds].filter(item => item !== user.id)
    const yourFriends = friends.filter(item => yourFriendIds.includes(item.id));


    return (
        <Box sx={{ bgcolor : "primary.main" , height : "95vh"}}>
            <Link href={"/"} style={{ textDecoration : "none" }}  >
                <Box sx={{ height : "80px" , display : "flex" , alignItems : "center" , p : "5px" , px : "10px" ,  gap : "10px" , ":hover" : { bgcolor : "#3b4044" }}} >
                    <Box sx={{ bgcolor : "info.main" , display : "flex" , justifyContent : "center" , alignItems : "center" , height : "55px" , width : "55px" , borderRadius : "30px" }} >
                        <BookmarkBorderRoundedIcon sx={{ fontSize : "35px" , color : "white"}} />
                    </Box>
                    <Box sx={{ display : "flex" , flexDirection : "column" , flexGrow : 1 , gap : "15px" }} >
                        <span></span>
                        <Box>
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
                        </Box>
                        <Divider sx={{ bgcolor : "" }} />
                    </Box> 
                </Box>
            </Link>
            {yourFriends.map(item => (
                <Link key={item.id} href={`./chats/${item.id}`} style={{ textDecoration : "none" }}  >
                    <Box sx={{ height : "80px" , display : "flex" , alignItems : "center" , p : "5px" , px : "10px" ,  gap : "10px" , ":hover" : { bgcolor : "#3b4044" }}} >
                        <Box sx={{ bgcolor : "info.main" , display : "flex" , justifyContent : "center" , alignItems : "center" , height : "55px" , width : "55px" , borderRadius : "30px" , overflow : "hidden" }} >
                            <img alt="friend photo" src={item.profileUrl ? item.profileUrl : "/defaultProfile.jpg"} style={{ width : "55px"}} />
                        </Box>
                        <Box sx={{ display : "flex" , flexDirection : "column" , flexGrow : 1 , gap : "15px" }} >
                            <span></span>
                            <Box>
                                <Box sx={{ display : "flex" , justifyContent : "space-between" , alignItems : "center" }} >
                                    <Typography sx={{ color : "text.primary" }} >{item.firstName + " " + item.lastName}</Typography>
                                    <Typography sx={{ color : "GrayText"}} >9:00 PM</Typography>
                                </Box>
                                <Box sx={{ display : "flex" , justifyContent : "space-between" , alignItems : "center" }} >
                                    <Typography sx={{ color : "GrayText"}} >Lorem .......</Typography>
                                    <Box sx={{ border : "1px solid gray" , width : "25px" , height : "25px" , borderRadius : "25px" , display : "flex" , justifyContent : "center" , alignItems : "center"}} >
                                        <PushPinRoundedIcon sx={{ color : "GrayText" , fontSize : "16px" , rotate : "revert" , transform : "rotate(45deg)" }} />
                                    </Box>
                                </Box>
                            </Box>
                            <Divider sx={{ bgcolor : "" }} />
                        </Box> 
                    </Box>
                </Link>
            ))}
        </Box>
    )
}

// here

export default ChatsPage;