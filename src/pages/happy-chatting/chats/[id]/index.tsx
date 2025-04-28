import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Box, IconButton, Input, Typography } from "@mui/material";
import { useRouter } from "next/router";
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import SentimentSatisfiedOutlinedIcon from '@mui/icons-material/SentimentSatisfiedOutlined';
import AttachmentOutlinedIcon from '@mui/icons-material/AttachmentOutlined';
import KeyboardVoiceOutlinedIcon from '@mui/icons-material/KeyboardVoiceOutlined';
import { useEffect, useRef, useState } from "react";
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { createChat, updateChat } from "@/store/slices/chatsSlice";
import { Chats, UserIdAndFriendId } from "@prisma/client";
import { ChatMenuType,  ConfirmationItemsType,  NewChat } from "@/types/chats";
import MessageMenu from "@/components/MessageMenu";
import ReplyOrEdit from "@/components/ReplyOrEdit";
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import Confirmation from "@/components/Confirmation";
import PinMessages from "@/components/PinMessages";


const defaultNewChat : NewChat = {
    message : "" , friendId : 0 , userId : 0 , replyId : null
}

const ChattingPage = () => {
    const [ newChat , setNewChat ] = useState<NewChat>(defaultNewChat);
    const [ currentChats , setCurrentChats ] = useState<Chats[]>([]);
    const [ chatMenu , setChatMenu ] = useState<ChatMenuType>( {chat : null , anchorEl : null });
    const [ replyChat , setReplyChat ] = useState<Chats | null>(null);
    const [ editedChat , setEditedChat ] = useState<Chats | null>(null);
    const [ confirmationItems , setConfirmationItems ] = useState<ConfirmationItemsType>( {open : false} );
    const [ pinChats , setPinChats ] = useState<Chats[]>([]);
    const friends = useAppSelector(store => store.userSlice.friends);
    const user = useAppSelector(store => store.userSlice.user);
    const chats = useAppSelector(store => store.chatsSlice.chats);
    const userIdAndFriendIds = useAppSelector(store => store.userIdAndFriendIdSlice.userIdAndFriendIds);

    const router = useRouter();
    const query = router.query;
    const friendId = Number(query.id);
    const currentFriend = friends.find(item => item.id === friendId);
    const dispatch = useAppDispatch();
    const userAndFriendRelationIdFromUser = userIdAndFriendIds.find(item => item.userId === user?.id && item.friendId === friendId)?.id as number;

    const lastRef = useRef< HTMLDivElement | null >(null);
    const inputRef = useRef<HTMLInputElement | null >(null);
    const messageRef = useRef<{ [ key : number ] : HTMLDivElement | null }>({});

    useEffect(() => {
        if(friendId && user && currentFriend ) {
            setNewChat({ ...newChat , friendId , userId : user.id });
            const currentUserAndFriendRelationIds = userIdAndFriendIds.filter(item => (item.userId === user.id && item.friendId === currentFriend.id) || (item.userId === currentFriend.id && item.friendId === user.id )).map(item => item.id);
            const currChats = chats.filter(item => currentUserAndFriendRelationIds.includes(item.userAndFriendRelationId));
            setCurrentChats(currChats);
            const pinChats = currChats.filter(chat => chat.isPin === true);
            setPinChats(pinChats)
        }
    } , [ friendId , user , chats ]);

    useEffect(() => {
        if(lastRef.current) {
            lastRef.current.scrollIntoView({ behavior: 'instant' });
        }
        if( inputRef.current) {
            const inputTag = inputRef.current.querySelector('input');
            if(inputTag) {
                inputTag.focus();
            }
        }
    } , [lastRef.current , replyChat , editedChat , currentChats.filter(item => item.userAndFriendRelationId === userAndFriendRelationIdFromUser).length ])
        
    if(!currentFriend || !user) return null;

    const handleCreateChat = () => {
        dispatch(createChat({...newChat , isSuccess : () => {
            setNewChat(defaultNewChat);
            setReplyChat(null)
        }}))
    }

    const handleUpdateChat = () => {
        if(editedChat) {
            const oldChat = currentChats.find(chat => chat.id === editedChat.id);
            editedChat.message = editedChat.message.trim();
            if(oldChat && editedChat.message !== oldChat.message ) {
                dispatch(updateChat({...editedChat , isSuccess : () => {
                    setEditedChat(null);
                }})) 
            } else {
                setEditedChat(null);
            }
        }
    }

    return (
        <Box sx={{ height : "100vh" , display : "flex" , flexDirection : "column" , justifyContent : "center" , alignItems : "center"}}>
            <Box sx={{ backgroundAttachment : "fixed", position : "fixed" , top : "0px" , width : "100vw" }}>
                <Box sx={{ bgcolor : "secondary.main" , p : "10px" , display : "flex" , alignItems : "center" , justifyContent : "space-between" }} >
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
                {pinChats.length && <PinMessages pinChats={pinChats} messageRef={messageRef} />}
            </Box>
            <Box sx={{ display : "flex" , flexDirection : "column" , gap : "1px" , overflowY: 'auto', bgcolor : "primary.main" , height : "100vh" , width : "100vw" , pt :(pinChats.length ? "112px" : "72px") , pb : (replyChat ? "97px" : "48px") }} >
                {currentChats.length ? currentChats.map(item => {
                    const createdTime = new Date(item.createdAt);
                    const updatedTime = new Date(item.updatedAt);
                    const userIdAndFriendIdOfChat = userIdAndFriendIds.find(element => element.id === item.userAndFriendRelationId) as UserIdAndFriendId;
                    const replyChat = chats.find(chat => chat.id === item.replyId);
                    const replyUserId = userIdAndFriendIds.find(userIdAndFriendId => replyChat && (userIdAndFriendId.id === replyChat.userAndFriendRelationId))?.userId;
                    const replyUser = (replyUserId === user.id) ? user : friends.find(friend => friend.id === replyUserId);
                    if(userIdAndFriendIdOfChat)
                    return (
                    <Box key={item.id} ref={(el : HTMLDivElement | null) => { messageRef.current[item.id] = el}} onClick={(event) => setChatMenu({ chat : item , anchorEl : event.currentTarget})} sx={{ bgcolor : "primary.main" , display : "flex" , justifyContent : (userIdAndFriendIdOfChat.userId === user.id) ? "flex-end" : "flex-start" , px : "5px" , py : "1.5px" , cursor : "pointer" }} >
                        <Box sx={{  bgcolor : (userIdAndFriendIdOfChat.userId === user.id) ? "#5f1f9e" : "secondary.main" , borderRadius : (userIdAndFriendIdOfChat.userId === user.id) ? "10px 10px 0px 10px" : "10px 10px 10px 0px" , maxWidth : "85%" , p : "6px" , display : "flex" , flexDirection : "column"  }}>
                            { (replyChat && replyUser) && (
                            <Box onClick={(e) => {
                                e.stopPropagation();
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
                                <Box sx={{ display : "flex" , justifyContent : "flex-end" , height : "11px" , flexGrow : 1 }}>
                                    <Typography sx={{ fontSize : "12px" ,  color : (userIdAndFriendIdOfChat.userId === user.id) ? "text.secondary" : "GrayText"}} >{(createdTime.getTime() === updatedTime.getTime() ? "" : "edited " ) + (createdTime.getHours() <= 12 ? (createdTime.getHours() === 0 ? 12 : createdTime.getHours()) :  (createdTime.getHours() - 12) ) + ":" + createdTime.getMinutes() + (createdTime.getHours() <= 12 ? " AM" : " PM" )}</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                )})
                : <Box></Box>}
                <div ref={lastRef} />
                <MessageMenu chatMenu={chatMenu} setChatMenu={setChatMenu} setReplyChat={setReplyChat} setNewChat={setNewChat} newChat={newChat} setEditedChat={setEditedChat} setConfirmationItems={setConfirmationItems} />
                <Confirmation confirmationItems={confirmationItems} setConfirmationItems={setConfirmationItems} />
            </Box>
            
            <Box sx={{ display : "flex" , flexDirection : "column" , gap : "1px" ,  backgroundAttachment : "fixed"  , position : "fixed" , bottom : "0px" , width : "100vw" }} >
                {replyChat && <ReplyOrEdit chat={replyChat} setChat={setReplyChat}  setNewChat={setNewChat} newChat={newChat} />}
                {editedChat && <ReplyOrEdit chat={editedChat} setChat={setEditedChat} />}
                <Box sx={{ bgcolor : "secondary.main" , display : "flex" , alignItems : "center" , justifyContent : "space-between" , gap : "5px" , py : "3px" }} >
                    <IconButton>
                        <SentimentSatisfiedOutlinedIcon sx={{ color : "GrayText"}} />
                    </IconButton>
                    <Input ref={inputRef} sx={{ flexGrow : 1}} value={editedChat ? editedChat.message : newChat.message} autoFocus placeholder="Message" onChange={(event) => editedChat ? setEditedChat({...editedChat , message : event.target.value}) :  setNewChat({...newChat , message : event.target.value})} />
                    {(newChat.message || editedChat?.message) ? editedChat?.message ? <IconButton onClick={handleUpdateChat} sx={{ bgcolor : "info.main" , width : "30px" , height : "30px" , mr : "5px"}} > 
                        <DoneRoundedIcon sx={{color : "text.primary" }} />
                    </IconButton>
                    : <IconButton onClick={handleCreateChat} > 
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