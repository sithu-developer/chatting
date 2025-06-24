import { Box, Divider, Typography } from "@mui/material";
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded';
import PushPinRoundedIcon from '@mui/icons-material/PushPinRounded';
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import { Chats, User, UserIdAndFriendId } from "@prisma/client";
import { useEffect, useState } from "react";
import { FriendAndChatAndRelationType } from "@/types/user";


const ChatsPage = () => {
    const friends = useAppSelector(store => store.userSlice.friends);
    const user = useAppSelector(store => store.userSlice.user) as User;
    const chats = useAppSelector(store => store.chatsSlice.chats);
    const userIdAndFriendIds = useAppSelector(store => store.userIdAndFriendIdSlice.userIdAndFriendIds);
    const [ friendsAndChatsAndRelation , setFriendsAndChatsAndRelation] = useState<FriendAndChatAndRelationType[]>([]);
    
    useEffect(() => {
        if(user && friends.length && chats.length && userIdAndFriendIds.length ) {
            const relationIdsOfFriendIds = userIdAndFriendIds.map(item => item.friendId);
            const relationIdsOfUserIds = userIdAndFriendIds.map(item => item.userId);
            const repeatedYourFriendIds = [...relationIdsOfFriendIds , ...relationIdsOfUserIds].filter(item => item !== user.id);
            
            const yourFriendIds = [...new Set(repeatedYourFriendIds) , ];
            const yourFriends = friends.filter(item => yourFriendIds.includes(item.id));

            const lastChatsAndRelatedFriendsAndRelation : FriendAndChatAndRelationType[] = yourFriendIds.map(friendId => {
                const currentFriendRelationIds =  userIdAndFriendIds.filter(userIdAndFriendId =>( userIdAndFriendId.friendId === friendId || userIdAndFriendId.userId === friendId)).map(item => item.id)
                const currentFriendLastChat = chats.findLast(chat => currentFriendRelationIds.includes(chat.userAndFriendRelationId)) as Chats;
                const relatedFriend = yourFriends.find(friend => friend.id === friendId) as User;
                const userIdAndFriendId = userIdAndFriendIds.find(item => item.userId === user.id && item.friendId === relatedFriend.id) as UserIdAndFriendId;
                return {friend : relatedFriend , chat : currentFriendLastChat , userIdAndFriendId };

            });

            const savedChatRelation = userIdAndFriendIds.find(item => item.userId === user.id && item.friendId === user.id );
            if(savedChatRelation) {
                const savedLastMessage = chats.findLast(chat => chat.userAndFriendRelationId === savedChatRelation.id) as Chats;
                lastChatsAndRelatedFriendsAndRelation.push({ chat : savedLastMessage , friend : user , userIdAndFriendId : savedChatRelation });
                const sortedItems = lastChatsAndRelatedFriendsAndRelation.sort(( a , b ) => b.chat.id - a.chat.id);
                setFriendsAndChatsAndRelation(sortedItems);
            } else {
                const sortedItems = lastChatsAndRelatedFriendsAndRelation.sort(( a , b ) => b.chat.id - a.chat.id);
                setFriendsAndChatsAndRelation(sortedItems);
            }

            
        }
    } , [ user , friends , chats , userIdAndFriendIds ])

    

    return (
        <Box sx={{ bgcolor : "primary.main" , height : "95vh"}}>
            {friendsAndChatsAndRelation.map(item => {
                const createdTime = new Date(item.chat.createdAt);
                return (
                    <Link key={item.friend.id} href={`./chats/${item.friend.id}`} style={{ textDecoration : "none" }}  >
                        <Box sx={{ height : "80px" , display : "flex" , alignItems : "center" , p : "5px" , px : "10px" ,  gap : "10px" , ":hover" : { bgcolor : "#3b4044" }}} >
                            {item.friend.id !== user.id ? <Box sx={{ bgcolor : "info.main" , display : "flex" , justifyContent : "center" , alignItems : "center" , height : "55px" , width : "55px" , borderRadius : "30px" , overflow : "hidden" }} >
                                <img alt="friend photo" src={item.friend.profileUrl ? item.friend.profileUrl : "/defaultProfile.jpg"} style={{ width : "55px"}} />
                            </Box>
                            :<Box sx={{ bgcolor : "info.main" , display : "flex" , justifyContent : "center" , alignItems : "center" , height : "55px" , width : "55px" , borderRadius : "30px" }} >
                                <BookmarkBorderRoundedIcon sx={{ fontSize : "35px" , color : "white"}} />
                            </Box>}
                            <Box sx={{ display : "flex" , flexDirection : "column" , flexGrow : 1 , gap : "15px" }} >
                                <span></span>
                                <Box>
                                    <Box sx={{ display : "flex" , justifyContent : "space-between" , alignItems : "center" }} >
                                        {item.friend.id !== user.id ? <Typography sx={{ color : "text.primary" }} >{item.friend.firstName + " " + item.friend.lastName}</Typography>
                                        :<Typography sx={{ color : "text.primary" }}>Saved Messages</Typography>}
                                        <Typography sx={{ color : "GrayText" , fontSize : "13px"}} >{(createdTime.getHours() <= 12 ? (createdTime.getHours() === 0 ? 12 : createdTime.getHours()) :  (createdTime.getHours() - 12) ) + ":" + createdTime.getMinutes() + (createdTime.getHours() <= 12 ? " AM" : " PM" )}</Typography>
                                    </Box>
                                    <Box sx={{ display : "flex" , justifyContent : "space-between" , alignItems : "center" }} >
                                        <Typography sx={{ color : "GrayText" , maxWidth : "65vw" , overflow : "hidden" , whiteSpace: 'nowrap', textOverflow : "ellipsis"}} >{item.chat.message}</Typography>
                                        {item.userIdAndFriendId.isPinChat ? <Box sx={{ border : "1px solid gray" , width : "22px" , height : "22px" , borderRadius : "22px" , display : "flex" , justifyContent : "center" , alignItems : "center"}} >
                                            <PushPinRoundedIcon sx={{ color : "GrayText" , fontSize : "14px" , rotate : "revert" , transform : "rotate(45deg)" }} />
                                        </Box>:
                                        <span></span>}
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