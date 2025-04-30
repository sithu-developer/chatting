import { Box, Dialog, DialogActions, Divider, IconButton, Input, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import SearchIcon from '@mui/icons-material/Search';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { FriendAndChatType } from "@/types/user";
import { Chats, User, UserIdAndFriendId } from "@prisma/client";
import PushPinRoundedIcon from '@mui/icons-material/PushPinRounded';
import { ForwardItemsType } from "@/types/chats";
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { createChat } from "@/store/slices/chatsSlice";
import { changeSnackBar } from "@/store/slices/generalSlice";
import { Severity } from "@/types/general";

interface Props {
    forwardItems : ForwardItemsType;
    setForwardItems : (value : ForwardItemsType) => void;
}

const ForwardMessage = ( { forwardItems , setForwardItems } : Props ) => {
    const [ searchOpen , setSearchOpen ] = useState<boolean>(false);
    const [ searchValue , setSearchValue ] = useState<string>("");
    const [ selectedFriends , setSelectedFriends ] = useState<User[]>([]);

    const friends = useAppSelector(store => store.userSlice.friends);
    const user = useAppSelector(store => store.userSlice.user) as User;
    const chats = useAppSelector(store => store.chatsSlice.chats);
    const userIdAndFriendIds = useAppSelector(store => store.userIdAndFriendIdSlice.userIdAndFriendIds);
    const [ friendsAndChats , setFriendsAndChats ] = useState<FriendAndChatType[]>([]);
    const filteredFriendsAndChats = friendsAndChats.filter(item => (item.friend.firstName + " " + item.friend.lastName).toLowerCase().includes(searchValue.toLowerCase()));

    const dispatch = useAppDispatch();

    useEffect(() => {
        if(user && friends.length && chats.length && userIdAndFriendIds.length ) {
            const relationIdsOfFriendIds = userIdAndFriendIds.map(item => item.friendId);
            const relationIdsOfUserIds = userIdAndFriendIds.map(item => item.userId);
            const repeatedYourFriendIds = [...relationIdsOfFriendIds , ...relationIdsOfUserIds].filter(item => item !== user.id)
            const yourFriendIds = [...new Set(repeatedYourFriendIds)];
            const yourFriends = friends.filter(item => yourFriendIds.includes(item.id));

            const lastChatsAndRelatedFriends : FriendAndChatType[] = yourFriendIds.map(friendId => {
                const currentFriendRelationIds =  userIdAndFriendIds.filter(userIdAndFriendId =>( userIdAndFriendId.friendId === friendId || userIdAndFriendId.userId === friendId)).map(item => item.id)
                const currentFriendLastChat = chats.findLast(chat => currentFriendRelationIds.includes(chat.userAndFriendRelationId)) as Chats;
                const relatedFriend = yourFriends.find(friend => friend.id === friendId) as User;
                return {friend : relatedFriend , chat : currentFriendLastChat };

            }).sort(( a , b ) => b.chat.id - a.chat.id) ;
            setFriendsAndChats(lastChatsAndRelatedFriends);
        }
    } , [ user , friends , chats , userIdAndFriendIds ])

    const handleForwardMessage = () => {
        const forwardFriendIds = selectedFriends.map(item => item.id);
        const forwardFriendId = (userIdAndFriendIds.find(item => item.id === (forwardItems.forwardChat as Chats).userAndFriendRelationId) as UserIdAndFriendId).userId;
        if(forwardItems.forwardChat) {
            dispatch(createChat({ message : forwardItems.forwardChat.message , forwardFriendIds , forwardFriendId , friendId : forwardFriendIds[0] , userId : user.id , replyId : null , isSuccess : () => {
                dispatch(changeSnackBar({isSnackBarOpen : true , message : "Message forward" , severity : Severity.success }));
                setForwardItems({ open : false , forwardChat : undefined });
                setSearchOpen(false);
                setSearchValue("");
                setSelectedFriends([]);
            } }))
        }
    }
    
    return (
        <Dialog open={forwardItems.open} onClose={() => {
            setForwardItems({ open : false , forwardChat : undefined });
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
                    const createdTime = new Date(item.chat.createdAt);
                    const exit = selectedFriends.find(friend => friend.id === item.friend.id );
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
                                <Box sx={{ bgcolor : "info.main" , display : "flex" , justifyContent : "center" , alignItems : "center" , height : "55px" , width : "55px" , borderRadius : "30px" , overflow : "hidden" }} >
                                    <img alt="friend photo" src={item.friend.profileUrl ? item.friend.profileUrl : "/defaultProfile.jpg"} style={{ width : "55px"}} />
                                </Box>
                                {exit && <Box  sx={{ position : "absolute" , bottom : "1px" , right : "1px" , bgcolor : "white" , width : "15px" , height : "15px" , borderRadius : "15px" , display : "flex" , justifyContent : "center" , alignItems : "center" }}>
                                    <CheckCircleRoundedIcon color="success" />
                                </Box>}
                            </Box>
                            <Box sx={{ display : "flex" , flexDirection : "column" , flexGrow : 1 , gap : "15px" }} >
                                <span></span>
                                <Box sx={{ userSelect : "none"}}>
                                    <Box sx={{ display : "flex" , justifyContent : "space-between" , alignItems : "center" }} >
                                        <Typography sx={{ color : "text.primary" }} >{item.friend.firstName + " " + item.friend.lastName}</Typography>
                                        <Typography sx={{ color : "GrayText" , fontSize : "13px"}} >{(createdTime.getHours() <= 12 ? (createdTime.getHours() === 0 ? 12 : createdTime.getHours()) :  (createdTime.getHours() - 12) ) + ":" + createdTime.getMinutes() + (createdTime.getHours() <= 12 ? " AM" : " PM" )}</Typography>
                                    </Box>
                                    <Box sx={{ display : "flex" , justifyContent : "space-between" , alignItems : "center" }} >
                                        <Typography sx={{ color : "GrayText" , maxWidth : "65vw" , overflow : "hidden" , whiteSpace: 'nowrap', textOverflow : "ellipsis"}} >{item.chat.message}</Typography>
                                        <Box sx={{ border : "1px solid gray" , width : "22px" , height : "22px" , borderRadius : "22px" , display : "flex" , justifyContent : "center" , alignItems : "center"}} >
                                            <PushPinRoundedIcon sx={{ color : "GrayText" , fontSize : "14px" , rotate : "revert" , transform : "rotate(45deg)" }} />
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
                        setForwardItems({ open : false , forwardChat : undefined });
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