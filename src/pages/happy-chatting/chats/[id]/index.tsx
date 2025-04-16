import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Box, Collapse, IconButton, Input, Typography } from "@mui/material";
import { useRouter } from "next/router";
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import SentimentSatisfiedOutlinedIcon from '@mui/icons-material/SentimentSatisfiedOutlined';
import AttachmentOutlinedIcon from '@mui/icons-material/AttachmentOutlined';
import KeyboardVoiceOutlinedIcon from '@mui/icons-material/KeyboardVoiceOutlined';
import { useEffect, useRef, useState } from "react";
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { createChat } from "@/store/slices/chatsSlice";
import { Chats, UserIdAndFriendId } from "@prisma/client";
import { ChatMenuType, NewChat } from "@/types/chats";
import MessageMenu from "@/components/MessageMenu";
import { TransitionGroup } from 'react-transition-group';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded';


const defaultNewChat : NewChat = {
    chat : "" , friendId : 0 , userId : 0
}

const ChattingPage = () => {
    const [ newChat , setNewChat ] = useState<NewChat>(defaultNewChat);
    const [ currentChats , setCurrentChats ] = useState<Chats[]>([]);
    const [ chatMenu , setChatMenu ] = useState<ChatMenuType>( {chat : null , anchorEl : null });
    const [ replyChat , setReplyChat ] = useState<Chats | null>(null);
    const router = useRouter();
    const query = router.query;
    const friendId = Number(query.id);
    const friends = useAppSelector(store => store.userSlice.friends);
    const currentFriend = friends.find(item => item.id === friendId);
    const user = useAppSelector(store => store.userSlice.user);
    const dispatch = useAppDispatch();
    const chats = useAppSelector(store => store.chatsSlice.chats);
    const userIdAndFriendIds = useAppSelector(store => store.userIdAndFriendIdSlice.userIdAndFriendIds);
    const lastRef = useRef< HTMLDivElement | null >(null);

    useEffect(() => {
        if(friendId && user && currentFriend && chats.length ) {
            setNewChat({chat : "" , friendId , userId : user.id });
            const currentUserAndFriendRelationIds = userIdAndFriendIds.filter(item => (item.userId === user.id && item.friendId === currentFriend.id) || (item.userId === currentFriend.id && item.friendId === user.id )).map(item => item.id);
            const currChats = chats.filter(item => currentUserAndFriendRelationIds.includes(item.userAndFriendRelationId));
            setCurrentChats(currChats);
        }
    } , [ friendId , user , chats ])

    useEffect(() => {
        if(lastRef.current) {
            lastRef.current.scrollIntoView({ behavior: 'instant' });
        }
    } , [lastRef.current , replyChat])
    

    
    if(!currentFriend || !user) return null;

    const handleCreateChat = () => {
        dispatch(createChat({...newChat , isSuccess : () => {
            setNewChat(defaultNewChat);
        }}));
    }

    return (
        <Box sx={{ height : "100vh" , display : "flex" , flexDirection : "column" , justifyContent : "center" , alignItems : "center"}}>
            <Box sx={{ bgcolor : "secondary.main" , p : "10px" , display : "flex" , alignItems : "center" , justifyContent : "space-between" , backgroundAttachment : "fixed", position : "fixed" , top : "0px" , width : "100vw"}} >
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
            <Box sx={{ display : "flex" , flexDirection : "column" , gap : "3px" , overflowY: 'auto', bgcolor : "primary.main" , height : "100vh" , width : "100vw" , pt : "72px" , pb : (replyChat ? "97px" : "48px") }} >
                {currentChats.map(item => {
                    const time = new Date(item.createdAt);
                    const userIdAndFriendIdOfChat = userIdAndFriendIds.find(element => element.id === item.userAndFriendRelationId) as UserIdAndFriendId;
                    return (
                    <Box key={item.id} onClick={(event) => setChatMenu({ chat : item , anchorEl : event.currentTarget})} sx={{ bgcolor : "primary.main" , display : "flex" , justifyContent : (userIdAndFriendIdOfChat.userId === user.id) ? "flex-end" : "flex-start" , px : "5px" , cursor : "pointer" }} >
                        <Box sx={{ bgcolor : (userIdAndFriendIdOfChat.userId === user.id) ? "#5f1f9e" : "secondary.main" , display : "flex" , justifyContent : "space-between" , alignItems : "center" , width : "fit-content" , maxWidth : "80%" , p : "5px" , borderRadius : (userIdAndFriendIdOfChat.userId === user.id) ? "15px 15px 0px 15px" : "15px 15px 15px 0px" , flexWrap : "wrap" , wordBreak : "break-word"  }}>
                            <Typography sx={{ color : "text.primary"}} >{item.chat}</Typography>
                            <Box sx={{ display : "flex" , justifyContent : "flex-end" , width : "100%" , height : "15px"}}>
                                <Typography sx={{ fontSize : "12px" ,  color : (userIdAndFriendIdOfChat.userId === user.id) ? "text.secondary" : "GrayText"}} >{(time.getHours() > 12 ? time.getHours() - 12 : time.getHours()) + ":" + time.getMinutes() + " " + (time.getHours() > 12 ? "PM" : "AM")}</Typography>
                            </Box>
                        </Box>
                    </Box>
                )})}
                <Box ref={lastRef} />
                <MessageMenu chatMenu={chatMenu} setChatMenu={setChatMenu} setReplyChat={setReplyChat} />
            </Box>
            
            <Box sx={{ display : "flex" , flexDirection : "column" , gap : "1px" ,  backgroundAttachment : "fixed"  , position : "fixed" , bottom : "0px" , width : "100vw" }} >
                {replyChat && <TransitionGroup>
                    <Collapse >
                        <Box sx={{ display : "flex" , bgcolor : "secondary.main" , justifyContent : "space-between" , alignItems : "center" , gap : "10px" , pl : "10px" }} >
                            <ReplyRoundedIcon sx={{ color : "info.main" , fontSize : "35px"}} />
                            <Box sx={{ flexGrow : 1}}>
                                <Typography sx={{ color : "info.main" , fontWeight : "bold"}} >Reply to {currentFriend.firstName + " " + currentFriend.lastName}</Typography>
                                <Typography sx={{ color : "GrayText"}} >{replyChat.chat}</Typography>
                            </Box>
                            <IconButton onClick={() => setReplyChat(null)} >
                                <CloseRoundedIcon sx={{ color : "GrayText"}} />
                            </IconButton>
                        </Box>
                    </Collapse>
                </TransitionGroup>}
                <Box sx={{ bgcolor : "secondary.main" , display : "flex" , alignItems : "center" , justifyContent : "space-between" , gap : "5px" , py : "3px" }} >
                    <IconButton>
                        <SentimentSatisfiedOutlinedIcon sx={{ color : "GrayText"}} />
                    </IconButton>
                    <Input sx={{ flexGrow : 1}} value={newChat.chat} autoFocus placeholder="Message" onChange={(event) => setNewChat({...newChat , chat : event.target.value})} />
                    {newChat.chat ? <IconButton onClick={handleCreateChat} > 
                        <SendRoundedIcon sx={{color : "info.main" }} />
                    </IconButton>
                    :<Box sx={{ display : "flex"}} >
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