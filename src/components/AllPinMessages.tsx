import { useAppSelector } from "@/store/hooks";
import { Box, Dialog, DialogTitle, IconButton, Typography } from "@mui/material"
import { Chats, UserIdAndFriendId } from "@prisma/client";
import { RefObject } from "react";
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';


interface Props {
    pinChats : Chats[];
    messageRef :  RefObject<{
        [key: number]: HTMLDivElement | null;
    }>
    allPinOpen : boolean;
    setAllPinOpen : (value : boolean) => void;
}

const AllPinMessages = ({ pinChats , messageRef , allPinOpen , setAllPinOpen } : Props) => {
    const friends = useAppSelector(store => store.userSlice.friends);
    const user = useAppSelector(store => store.userSlice.user);
    const chats = useAppSelector(store => store.chatsSlice.chats);
    const userIdAndFriendIds = useAppSelector(store => store.userIdAndFriendIdSlice.userIdAndFriendIds);
    
    if(!user) return null;
    return (
        <Dialog open={allPinOpen} onClose={() => setAllPinOpen(false)} >
            <DialogTitle sx={{ bgcolor : "secondary.main" , display : "flex" , justifyContent : "space-between" , alignItems : "center"}} >
                <Typography sx={{ fontSize : "20px"}} >{pinChats.length} Pinned Messages</Typography>
                <IconButton onClick={() => setAllPinOpen(false)} >
                    <CloseRoundedIcon sx={{color : "white"}} />
                </IconButton>
            </DialogTitle>
            <Box sx={{ bgcolor : "primary.main" , p : "30px 20px"}}>
                {pinChats.map(item => {
                    const createdTime = new Date(item.createdAt);
                    const updatedTime = new Date(item.updatedAt);
                    const userIdAndFriendIdOfChat = userIdAndFriendIds.find(element => element.id === item.userAndFriendRelationId) as UserIdAndFriendId;
                    const replyChat = chats.find(chat => chat.id === item.replyId);
                    const replyUserId = userIdAndFriendIds.find(userIdAndFriendId => replyChat && (userIdAndFriendId.id === replyChat.userAndFriendRelationId))?.userId;
                    const replyUser = (replyUserId === user.id) ? user : friends.find(friend => friend.id === replyUserId);
                    if(userIdAndFriendIdOfChat)
                    return (
                    <Box key={item.id} sx={{ bgcolor : "primary.main" , display : "flex" , justifyContent : (userIdAndFriendIdOfChat.userId === user.id) ? "flex-end" : "flex-start" , alignItems : "center" , gap : "5px" , px : "5px" , py : "1.5px" , cursor : "pointer" }} >
                        <IconButton sx={{bgcolor : "secondary.main"}} onClick={(e) => {
                            e.stopPropagation();
                            setAllPinOpen(false);
                            const messageBox = messageRef.current[item.id];
                            if(messageBox) {
                                messageBox.scrollIntoView({behavior : "smooth" , block : "center"});
                                messageBox.style.backgroundColor= "rgba(206, 212, 224, 0.15)";
                                setTimeout(() => {
                                    messageBox.style.backgroundColor = "";
                                } , 2000)
                            }
                        }} >
                            <ArrowForwardRoundedIcon sx={{ color : "white"}} />
                        </IconButton>
                        <Box sx={{  bgcolor : (userIdAndFriendIdOfChat.userId === user.id) ? "#5f1f9e" : "secondary.main" , borderRadius : (userIdAndFriendIdOfChat.userId === user.id) ? "10px 10px 0px 10px" : "10px 10px 10px 0px" , maxWidth : "85%" , p : "6px" , display : "flex" , flexDirection : "column"  }}>
                            { (replyChat && replyUser) && (
                            <Box onClick={(e) => {
                                e.stopPropagation();
                                setAllPinOpen(false)
                                const replyBox = messageRef.current[replyChat.id];
                                if(replyBox) {
                                    replyBox.scrollIntoView({behavior : "smooth" , block : "center"});
                                    replyBox.style.backgroundColor = "rgba(206, 212, 224, 0.15)";
                                    setTimeout(() => {
                                        replyBox.style.backgroundColor = "";
                                    } , 2000)
                                }
                            }} sx={{ bgcolor : "rgba(255, 255, 255, 0.15)"  , borderRadius : "4px" , borderLeft : (userIdAndFriendIdOfChat.userId === user.id) ? "4px solid white" :( replyUser.id === user.id ) ? "4px solid rgb(6, 188, 76)" :  "4px solid rgb(171, 109, 233)" , px : "5px" }}>
                                <Typography sx={{ color : (userIdAndFriendIdOfChat.userId === user.id) ? "text.secondary" :( replyUser.id === user.id ) ? "rgb(6, 188, 76)" : "rgb(171, 109, 233)" , fontWeight : "bold"}} >{replyUser.firstName + " " + replyUser.lastName}</Typography>
                                <Typography sx={{ color : "text.secondary"}}>{replyChat.message}</Typography>
                            </Box>)}
                            <Box sx={{ display : "flex" , justifyContent : "space-between" , alignItems : "center" , gap : "5px" , flexWrap : "wrap" , wordBreak : "break-word"  , flexGrow : 1 }}>
                                <Typography sx={{ color : "text.primary" , flexGrow : 1 }} >{item.message}</Typography>
                                <Box sx={{ display : "flex" , justifyContent : "flex-end" , gap : "4px" , height : "11px" , flexGrow : 1 }}>
                                    <Typography sx={{ fontSize : "12px" ,  color : (userIdAndFriendIdOfChat.userId === user.id) ? "text.secondary" : "GrayText"}} >{(createdTime.getTime() === updatedTime.getTime() ? "" : "edited " ) + (createdTime.getHours() <= 12 ? (createdTime.getHours() === 0 ? 12 : createdTime.getHours()) :  (createdTime.getHours() - 12) ) + ":" + createdTime.getMinutes() + (createdTime.getHours() <= 12 ? " AM" : " PM" )}</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                )})}
            </Box>
        </Dialog>
    )
}

export default AllPinMessages;