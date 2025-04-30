import { Box, Divider, Typography } from "@mui/material";
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded';
import PushPinRoundedIcon from '@mui/icons-material/PushPinRounded';
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import { Chats, User } from "@prisma/client";
import { useEffect, useState } from "react";
import { FriendAndChatType } from "@/types/user";


const ChatsPage = () => {
    const friends = useAppSelector(store => store.userSlice.friends);
    const user = useAppSelector(store => store.userSlice.user) as User;
    const chats = useAppSelector(store => store.chatsSlice.chats);
    const userIdAndFriendIds = useAppSelector(store => store.userIdAndFriendIdSlice.userIdAndFriendIds);
    const [ friendsAndChats , setFriendsAndChats ] = useState<FriendAndChatType[]>([]);
    
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
                        <Divider />
                    </Box> 
                </Box>
            </Link>
            {friendsAndChats.map(item => {
                const createdTime = new Date(item.chat.createdAt);
                return (
                    <Link key={item.friend.id} href={`./chats/${item.friend.id}`} style={{ textDecoration : "none" }}  >
                        <Box sx={{ height : "80px" , display : "flex" , alignItems : "center" , p : "5px" , px : "10px" ,  gap : "10px" , ":hover" : { bgcolor : "#3b4044" }}} >
                            <Box sx={{ bgcolor : "info.main" , display : "flex" , justifyContent : "center" , alignItems : "center" , height : "55px" , width : "55px" , borderRadius : "30px" , overflow : "hidden" }} >
                                <img alt="friend photo" src={item.friend.profileUrl ? item.friend.profileUrl : "/defaultProfile.jpg"} style={{ width : "55px"}} />
                            </Box>
                            <Box sx={{ display : "flex" , flexDirection : "column" , flexGrow : 1 , gap : "15px" }} >
                                <span></span>
                                <Box>
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
                    </Link>
                )
            })}
        </Box>
    )
}

// here

export default ChatsPage;