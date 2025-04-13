import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Box, IconButton, Input, Typography } from "@mui/material";
import { useRouter } from "next/router";
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import SentimentSatisfiedOutlinedIcon from '@mui/icons-material/SentimentSatisfiedOutlined';
import AttachmentOutlinedIcon from '@mui/icons-material/AttachmentOutlined';
import KeyboardVoiceOutlinedIcon from '@mui/icons-material/KeyboardVoiceOutlined';
import { useEffect, useState } from "react";
import { NewChat } from "@/types/chats";
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { createChat } from "@/store/slices/chatsSlice";

const defaultNewChat : NewChat = {
    chat : "" , friendId : 0 , userId : 0
}

const ChattingPage = () => {
    const [ newChat , setNewChat ] = useState<NewChat>(defaultNewChat);
    const router = useRouter();
    const query = router.query;
    const id = Number(query.id);
    const friends = useAppSelector(store => store.userSlice.friends);
    const currentFriend = friends.find(item => item.id === id);
    const user = useAppSelector(store => store.userSlice.user);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if(id && user) {
            setNewChat({chat : "" , friendId : id , userId : user.id })   
        }
    } , [id , user ])
    
    if(!currentFriend) return null;

    const handleCreateChat = () => {
        dispatch(createChat({...newChat}));
    }

    return (
        <Box>
            <Box sx={{ bgcolor : "secondary.main" , p : "10px" , display : "flex" , alignItems : "center" , justifyContent : "space-between"}} >
                <Box sx={{ display : "flex" , alignItems : "center" , gap : "10px" }}>
                    <IconButton onClick={() => router.push("/happy-chatting/chats")} >
                        <ArrowBackRoundedIcon sx={{ color : "white"}} />
                    </IconButton>
                    <Box sx={{ width : "45px" , height : "45px" , borderRadius : "30px" , overflow : "hidden" , display : "flex" , justifyContent : "center" , alignItems : "center" }} >
                        <img alt="your friend profile" src={currentFriend.profileUrl ? currentFriend.profileUrl : "/defaultProfile.jpg"} style={{ width : "45px"}} />
                    </Box>
                    <Box >
                        <Typography sx={{ color : "white"}} >{currentFriend.firstName + " " + currentFriend.lastName }</Typography>
                        <Typography sx={{ color : (currentFriend.isOnline ? "info.main" : "GrayText" )}}  >{currentFriend.isOnline ? "online" : "offline"}</Typography>
                    </Box>
                </Box>
                <IconButton>
                    <MoreVertRoundedIcon sx={{ color : "white"}} />
                </IconButton>
            </Box>
            {/* // start here  */}
            <Box sx={{ height : "93vh" , bgcolor : "primary.main" }}>
                <Box sx={{ bgcolor : "secondary.main" , display : "flex" , alignItems : "center" , justifyContent : "space-between" , gap : "5px" , backgroundAttachment : "fixed" , zIndex : 1000 , position : "fixed" , bottom : "0px" , width : "100vw" }} >
                    <IconButton>
                        <SentimentSatisfiedOutlinedIcon sx={{ color : "GrayText"}} />
                    </IconButton>
                    <Input sx={{ flexGrow : 1}} defaultValue={newChat.chat} autoFocus placeholder="Message" onChange={(event) => setNewChat({...newChat , chat : event.target.value})} />
                    {newChat.chat ? <IconButton onClick={handleCreateChat} > 
                        <SendRoundedIcon sx={{color : "info.main" }} />
                    </IconButton>
                    :<Box>
                        <IconButton>
                            <AttachmentOutlinedIcon sx={{ transform : "rotate(135deg)" , color : "GrayText"}} />
                        </IconButton>
                        <IconButton>
                            <KeyboardVoiceOutlinedIcon sx={{ color : "GrayText"}} />
                        </IconButton>
                    </Box>}
                </Box>
            </Box>
        </Box>
    )
}

export default ChattingPage;