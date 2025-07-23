import { Box, Dialog, DialogActions, Divider, IconButton, Input, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import SearchIcon from '@mui/icons-material/Search';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { FriendAndChatAndRelationType } from "@/types/user";
import { Chats, User } from "@prisma/client";
import PushPinRoundedIcon from '@mui/icons-material/PushPinRounded';
import { ForwardItemsType } from "@/types/chats";
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { createChat } from "@/store/slices/chatsSlice";
import { changeSnackBar } from "@/store/slices/generalSlice";
import { Severity } from "@/types/general";
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded';
import Image from "next/image";
import { timeCalcFunction } from "@/util/general";
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded';
import { defaultReturnChat, defaultReturnFriend, defaultReturnRelation } from "@/pages/happy-chatting/chats";

interface Props {
    forwardItems : ForwardItemsType;
    setForwardItems : (value : ForwardItemsType) => void;
    setSelectedChats : (value : Chats[]) => void;
}

const ForwardMessage = ( { forwardItems , setForwardItems , setSelectedChats } : Props ) => {
    const [ searchOpen , setSearchOpen ] = useState<boolean>(false);
    const [ searchValue , setSearchValue ] = useState<string>("");
    const [ selectedFriends , setSelectedFriends ] = useState<User[]>([]);

    const friends = useAppSelector(store => store.userSlice.friends);
    const user = useAppSelector(store => store.userSlice.user) as User;
    const chats = useAppSelector(store => store.chatsSlice.chats);
    const userIdAndFriendIds = useAppSelector(store => store.userIdAndFriendIdSlice.userIdAndFriendIds);
    const [ friendsAndChatsAndRelation , setFriendsAndChatsAndRelation] = useState<FriendAndChatAndRelationType[]>([]);
    const filteredFriendsAndChats = friendsAndChatsAndRelation.filter(item => (item.friend.firstName + " " + item.friend.lastName).toLowerCase().includes(searchValue.toLowerCase()));

    const dispatch = useAppDispatch();

    useEffect(() => {
        if(user && friends.length && chats.length && userIdAndFriendIds.length ) {
            const relationIdsOfFriendIds = userIdAndFriendIds.map(item => item.friendId);
            const relationIdsOfUserIds = userIdAndFriendIds.map(item => item.userId);
            const repeatedYourFriendIds = [...relationIdsOfFriendIds , ...relationIdsOfUserIds].filter(item => item !== user.id)
            
            const yourFriendIds = [...new Set(repeatedYourFriendIds)];
            const yourFriends = friends.filter(item => yourFriendIds.includes(item.id));

            const lastChatsAndRelatedFriendsAndRelation : FriendAndChatAndRelationType[] = yourFriendIds.map(friendId => {
                const currentFriendRelationIds =  userIdAndFriendIds.filter(userIdAndFriendId =>( userIdAndFriendId.friendId === friendId || userIdAndFriendId.userId === friendId)).map(item => item.id)
                const currentFriendLastChat = chats.findLast(chat => currentFriendRelationIds.includes(chat.userAndFriendRelationId));
                const relatedFriend = yourFriends.find(friend => friend.id === friendId);
                const userIdAndFriendId = userIdAndFriendIds.find(item => item.userId === user.id && item.friendId === relatedFriend?.id);
                return {friend : (relatedFriend ? relatedFriend : defaultReturnFriend ) , chat : (currentFriendLastChat ? currentFriendLastChat : defaultReturnChat) , userIdAndFriendId : (userIdAndFriendId ? userIdAndFriendId : defaultReturnRelation ) };
            });

            const savedChatRelation = userIdAndFriendIds.find(item => item.userId === user.id && item.friendId === user.id );
            if(savedChatRelation) {
                const savedLastMessage = chats.findLast(chat => chat.userAndFriendRelationId === savedChatRelation.id) as Chats;
                lastChatsAndRelatedFriendsAndRelation.push({ chat : savedLastMessage , friend : user , userIdAndFriendId : savedChatRelation });
                const sortedItems = lastChatsAndRelatedFriendsAndRelation.sort(( a , b ) => b.chat.id - a.chat.id);
                const pinFristItems = [...sortedItems.filter(item => item.userIdAndFriendId.isPinChat === true) , ...sortedItems.filter(item => !item.userIdAndFriendId.isPinChat)];
                setFriendsAndChatsAndRelation(pinFristItems);
            } else {
                const sortedItems = lastChatsAndRelatedFriendsAndRelation.sort(( a , b ) => b.chat.id - a.chat.id);
                const pinFristItems = [...sortedItems.filter(item => item.userIdAndFriendId.isPinChat === true) , ...sortedItems.filter(item => !item.userIdAndFriendId.isPinChat)];
                setFriendsAndChatsAndRelation(pinFristItems);
            }
        }
    } , [ user , friends , chats , userIdAndFriendIds ])

    const handleForwardMessage = () => {
        const forwardFriendIds = selectedFriends.map(item => item.id);
        if(forwardItems.forwardChats && forwardItems.forwardChats.length) {
            dispatch(createChat({ message : "Forward Chat" , forwardFriendIds , forwardChats : forwardItems.forwardChats , friendId : forwardFriendIds[0] , userId : user.id , replyId : null , isSuccess : () => {
                dispatch(changeSnackBar({isSnackBarOpen : true , message : (forwardItems.forwardChats && forwardItems.forwardChats.length > 1) ? "Messages forwarded" : "Message forwarded" , severity : Severity.success }));
                setForwardItems({ open : false , forwardChats : undefined });
                setSearchOpen(false);
                setSearchValue("");
                setSelectedFriends([]);
                setSelectedChats([]);
            } }))
        }
    }
    
    return (
        <Dialog open={forwardItems.open} onClose={() => {
            setForwardItems({ open : false , forwardChats : undefined });
            setSearchOpen(false);
            setSearchValue("");
            setSelectedFriends([]);
        }} >
            <Box sx={{ bgcolor : "secondary.main" , display : "flex" , justifyContent : "space-between" , alignItems : "center" , p : "5px 5px 5px 20px"}} >
                {searchOpen ? <Input autoFocus placeholder="Search" value={searchValue} onChange={(event) => setSearchValue(event.target.value)} />
                : <Typography sx={{ userSelect : "none"}} >Forward to...</Typography>}
                {!searchOpen ? <IconButton onClick={() => setSearchOpen(true) } >
                    <SearchIcon sx={{ color : "white"}} />
                </IconButton>
                :<IconButton onClick={() => {
                    setSearchOpen(false);
                    setSearchValue("");
                }} >
                    <CloseRoundedIcon  sx={{ color : "white"}}  />
                </IconButton>}
            </Box>
            <Box sx={{ bgcolor : "primary.main" , minWidth : "300px" , maxHeight : "70vh" }} >
                {filteredFriendsAndChats.map(item => {
                    const exit = selectedFriends.find(friend => friend.id === item.friend.id );
                    const friendRelation = userIdAndFriendIds.find(relation => (relation.userId === item.userIdAndFriendId.friendId) && (relation.friendId === item.userIdAndFriendId.userId));
                    const unseenMessageCount = chats.filter(chat => (chat.userAndFriendRelationId === friendRelation?.id) && !chat.seen).length;
                    
                    return (
                        <Box key={item.friend.id} onClick={() => {
                            if(exit) {
                                const friendsAfterRemove  = selectedFriends.filter(friend => friend.id !== item.friend.id);
                                setSelectedFriends(friendsAfterRemove);
                            } else {
                                setSelectedFriends([...selectedFriends , item.friend ]);
                            }
                        }} sx={{ height : "80px" , display : "flex" , alignItems : "center" , p : "5px" , px : "10px" ,  gap : "10px" , cursor : "pointer" , ":hover" : { bgcolor : "#3b4044" }}} >
                            <Box sx={{ position : "relative"}}>
                                {item.friend.id !== user.id ? <Box sx={{ bgcolor : "info.main" , display : "flex" , justifyContent : "center" , alignItems : "center" , height : "55px" , width : "55px" , borderRadius : "30px" , overflow : "hidden" }} >
                                    <Image alt="friend photo" src={item.friend.profileUrl ? item.friend.profileUrl : "/defaultProfile.jpg"} width={200} height={200} style={{ width : "55px" , height : "auto" , minHeight : "55px"}} />
                                </Box>
                                :<Box sx={{ bgcolor : "info.main" , display : "flex" , justifyContent : "center" , alignItems : "center" , height : "55px" , width : "55px" , borderRadius : "30px" }} >
                                    <BookmarkBorderRoundedIcon sx={{ fontSize : "35px" , color : "white"}} />
                                </Box>}
                                {exit && <Box  sx={{ position : "absolute" , bottom : "1px" , right : "1px" , bgcolor : "white" , width : "15px" , height : "15px" , borderRadius : "15px" , display : "flex" , justifyContent : "center" , alignItems : "center" }}>
                                    <CheckCircleRoundedIcon color="success" />
                                </Box>}
                            </Box>
                            <Box sx={{ display : "flex" , flexDirection : "column" , flexGrow : 1 , gap : "15px" }} >
                                <span></span>
                                <Box sx={{ userSelect : "none"}}>
                                    <Box sx={{ display : "flex" , justifyContent : "space-between" , alignItems : "center" }} >
                                        {item.friend.id !== user.id ? <Typography sx={{ color : "text.primary" }} >{item.friend.firstName + " " + item.friend.lastName}</Typography>
                                        :<Typography sx={{ color : "text.primary" }}>Saved Messages</Typography>}
                                        <Box sx={{ display : "flex" , gap : "3px" , alignItems : "center"}}>
                                            {item.userIdAndFriendId.id !== item.chat.userAndFriendRelationId || item.friend.id === user.id ? 
                                            undefined
                                            : (item.chat.seen ? <DoneAllRoundedIcon sx={{ fontSize : "18px" , color : "info.main" }} /> : <DoneRoundedIcon sx={{ fontSize : "18px" , color : "info.main" }} />)}
                                            <Typography sx={{ color : "GrayText" , fontSize : "13px"}} >{timeCalcFunction(item.chat)}</Typography>
                                        </Box>
                                    </Box>
                                    <Box sx={{ display : "flex" , justifyContent : "space-between" , alignItems : "center" }} >
                                        <Box sx={{ display : "flex" , gap : "5px" , alignItems : "center"}}>
                                            {item.chat.imageMessageUrl ? 
                                            <Box sx={{ display : "flex" , justifyContent : "center" , alignItems : "center" , overflow : "hidden" , width : "30px" , height : "30px" , borderRadius : "5px"}}>
                                                <Image alt="message photo" src={item.chat.imageMessageUrl} width={200} height={200} style={{ width : "30px" , height : "auto"}} /> 
                                            </Box>
                                            :undefined}
                                            {item.chat.message ? 
                                            <Typography sx={{ color : "GrayText" , maxWidth : "65vw" , overflow : "hidden" , whiteSpace: 'nowrap', textOverflow : "ellipsis"}} >{item.chat.voiceMessageUrl ? "🎤 " + item.chat.message : item.chat.message}</Typography>
                                            :<Typography sx={{ color : "info.main" , maxWidth : "65vw" , overflow : "hidden" , whiteSpace: 'nowrap', textOverflow : "ellipsis"}} >{item.chat.imageMessageUrl ? "Photo" : "Voice message"}</Typography>}
                                        </Box>
                                        <Box sx={{ display : "flex" , gap : "5px" , alignItems : "center"}}>
                                            {!unseenMessageCount || item.friend.id === user.id ? 
                                            undefined
                                            :<Box sx={{ bgcolor : "info.main" , height : "20px" , minWidth : "20px" , px : "5px" , borderRadius : "15px" , display : "flex" , justifyContent : "center" , alignItems : "center" }} >
                                                <Typography sx={{ color : "white" , fontSize : "14px"}}>{unseenMessageCount}</Typography>
                                            </Box>}
                                            {item.userIdAndFriendId.isPinChat ? <Box sx={{ border : "1px solid gray" , width : "22px" , height : "22px" , borderRadius : "22px" , display : "flex" , justifyContent : "center" , alignItems : "center"}} >
                                                <PushPinRoundedIcon sx={{ color : "GrayText" , fontSize : "14px" , rotate : "revert" , transform : "rotate(45deg)" }} />
                                            </Box>:
                                            <span></span>}
                                        </Box>
                                    </Box>
                                </Box>
                                <Divider />
                            </Box> 
                        </Box>
                    )
                })}
            </Box>
            <DialogActions sx={{ bgcolor : "primary.main" , display : "flex" , gap : "5px" }} >
                <IconButton  sx={{ bgcolor : "secondary.main" , ":hover" : { bgcolor : "secondary.dark" }}}
                    onClick={() => {
                        setForwardItems({ open : false , forwardChats : undefined });
                        setSearchOpen(false);
                        setSearchValue("");
                        setSelectedFriends([]);
                    }}
                >
                    <CloseRoundedIcon sx={{ color : "white"}} />
                </IconButton>
                <IconButton disabled={!selectedFriends.length} onClick={handleForwardMessage} sx={{ bgcolor : "info.main" , ":hover" : { bgcolor : "info.dark"}}} >
                    <SendRoundedIcon sx={{ color : (!selectedFriends.length ? "primary.dark" : "white") , ml : "2px"  }} />
                </IconButton>
            </DialogActions>
        </Dialog>
    )
}

export default ForwardMessage;