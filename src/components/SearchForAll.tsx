import { useAppSelector } from '@/store/hooks';
import { FriendAndChatAndRelationType } from '@/types/user';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { Box, Dialog, Divider, IconButton, TextField, Typography } from "@mui/material";
import { Chats, User, UserIdAndFriendId } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded';
import { useRouter } from 'next/router';


interface Props {
    searchForAllOpen : boolean;
    setSearchForAllOpen : (value : boolean) => void;
}

const SearchForAll = ( { searchForAllOpen , setSearchForAllOpen } : Props ) => {
    const [ searchString , setSearchString ] = useState<string>("");
    const [ friendsAndChatsAndRelation , setFriendsAndChatsAndRelation] = useState<FriendAndChatAndRelationType[]>([]);
    const [ filteredChats , setFilteredChats ] = useState<Chats[]>([]);
    const friends = useAppSelector(store => store.userSlice.friends);
    const user = useAppSelector(store => store.userSlice.user);
    const chats = useAppSelector(store => store.chatsSlice.chats);
    const userIdAndFriendIds = useAppSelector(store => store.userIdAndFriendIdSlice.userIdAndFriendIds);
    const router = useRouter();

    useEffect(() => {
        if(friends.length && user && chats.length && userIdAndFriendIds.length) {
            const relationIdsOfFriendIds = userIdAndFriendIds.map(item => item.friendId);
            const relationIdsOfUserIds = userIdAndFriendIds.map(item => item.userId);
            const repeatedYourFriendIds = [...relationIdsOfFriendIds , ...relationIdsOfUserIds].filter(item => item !== user.id);
            
            const yourFriendIds = [...new Set(repeatedYourFriendIds) ];
            const yourFriends = friends.filter(item => yourFriendIds.includes(item.id));

            const lastChatsAndRelatedFriendsAndRelation : FriendAndChatAndRelationType[] = yourFriendIds.map(friendId => {
                const currentFriendRelationIds =  userIdAndFriendIds.filter(userIdAndFriendId =>( userIdAndFriendId.friendId === friendId || userIdAndFriendId.userId === friendId)).map(item => item.id)
                const currentFriendLastChat = chats.findLast(chat => currentFriendRelationIds.includes(chat.userAndFriendRelationId)) as Chats;
                
                const relatedFriend = yourFriends.find(friend => friend.id === friendId) as User;
                const userIdAndFriendId = userIdAndFriendIds.find(item => item.userId === user.id && item.friendId === relatedFriend.id) as UserIdAndFriendId;
                return {friend : relatedFriend , chat : currentFriendLastChat , userIdAndFriendId };
            });

            const sortedItems = lastChatsAndRelatedFriendsAndRelation.sort(( a , b ) => b.chat.id - a.chat.id);
            const pinFristItems = [...sortedItems.filter(item => item.userIdAndFriendId.isPinChat === true) , ...sortedItems.filter(item => !item.userIdAndFriendId.isPinChat)];
            
            const sortedChats = [...chats].sort((a,b) => b.id - a.id);
            if(searchString.trim()) {
                const filteredItemsForFriends = pinFristItems.filter(item => (item.friend.firstName.toLowerCase() + " " + item.friend.lastName.toLowerCase()).includes(searchString.toLowerCase().trim()))
                const filteredChatsForMessages = sortedChats.filter(item => item.message.toLowerCase().includes(searchString.toLowerCase().trim()));
                setFriendsAndChatsAndRelation(filteredItemsForFriends);
                setFilteredChats(filteredChatsForMessages);
            } else {
                setFriendsAndChatsAndRelation(pinFristItems);
                setFilteredChats(sortedChats);
            }
        
        }

    } , [friends , user , chats , userIdAndFriendIds , searchString])

    if(!user) return null;
    return (
        <Dialog fullScreen open={searchForAllOpen} >
            <Box sx={{ bgcolor : "secondary.main" , p : "10px" , py : "14px" , display : "flex" , alignItems : "center" , gap : "10px" }} >
                <IconButton onClick={() => {
                    setSearchForAllOpen(false);
                    setSearchString("");
                }} >
                    <ArrowBackRoundedIcon sx={{ color : "white"}} />
                </IconButton>
                <TextField autoFocus variant="standard" value={searchString} placeholder="Search" color="secondary" sx={{ flexGrow : 1}} onChange={(event) => setSearchString(event.target.value) } />
                <IconButton onClick={() => setSearchString("")}>
                    <CloseRoundedIcon sx={{ color : "white"}} />
                </IconButton>
            </Box>
            <Box sx={{ bgcolor : "secondary.dark" , width : "100vw" , p : "3px 10px" }}>
                <Typography sx={{ color : "GrayText" , fontWeight: "900" , fontSize : "15px" }}>Chats</Typography>
            </Box>
            <Box sx={{bgcolor : "secondary.main" , display : "flex" , gap : "20px" , p : "8px 10px" , width : "100vw" , overflowX : "auto" }}>
                {friendsAndChatsAndRelation.length ? friendsAndChatsAndRelation.map(item => {
                    const friendRelation = userIdAndFriendIds.find(relation => (relation.userId === item.userIdAndFriendId.friendId) && (relation.friendId === item.userIdAndFriendId.userId));
                    const unseenMessageCount = chats.filter(chat => (chat.userAndFriendRelationId === friendRelation?.id) && !chat.seen).length;
                return (
                    <Link href={`./chats/${item.friend.id}`} key={item.friend.id} style={{ textDecoration : "none"}}>
                        <Box sx={{ display : "flex" , flexDirection : "column" , alignItems : "center" , position : "relative"}}>
                            <Box sx={{ bgcolor : "info.main" , display : "flex" , justifyContent : "center" , alignItems : "center" , height : "55px" , width : "55px" , borderRadius : "30px" , overflow : "hidden" }} >
                                <Image alt="friend photo" src={item.friend.profileUrl ? item.friend.profileUrl : "/defaultProfile.jpg"} width={300} height={300} style={{ width : "55px" , height : "auto" , minHeight : "55px"}} />
                            </Box>
                            {unseenMessageCount ? 
                            <Box sx={{ bgcolor : "info.main" , height : "20px" , minWidth : "20px" , px : "5px" , borderRadius : "15px" , display : "flex" , justifyContent : "center" , alignItems : "center" , position : "absolute" , right : "-7px" }} >
                                <Typography sx={{ color : "white" , fontSize : "12px"}}>{unseenMessageCount}</Typography>
                            </Box>
                            :undefined}
                            {item.friend.isOnline ? 
                            <Box sx={{ bgcolor : "info.main" , height : "12px" , width : "12px" , borderRadius : "12px" , position : "absolute" , bottom : "22px" , right : "3px" , border : "2px solid #1D2D41"}} />
                            :undefined}
                            <Typography sx={{ fontSize : "13px" , maxWidth : "60px" , overflow : "hidden" , textOverflow : "ellipsis" , textWrap : "nowrap" , color : "white" }}>{item.friend.firstName + " " + item.friend.lastName}</Typography>
                        </Box>
                    </Link>
                )})
                :<Typography sx={{ flexGrow : 1 , textAlign : "center" , p : "20px" , fontSize : "23px" }}>No Result</Typography>}
            </Box>
            <Box sx={{ bgcolor : "secondary.dark" , width : "100vw" , p : "3px 10px"}}>
                <Typography sx={{ color : "GrayText" , fontWeight: "900" , fontSize : "15px"}}>Messages</Typography>
            </Box>
            <Box sx={{ bgcolor : "secondary.main" , height : "calc(100vh - 215px)" , overflowY : "auto" , display : "flex" , flexDirection : "column" }} >
                {filteredChats.length ? filteredChats.map(chat => {
                    const currentRelation = userIdAndFriendIds.find(relation => relation.id === chat.userAndFriendRelationId);
                    if(!currentRelation) return null;
                    const friendId = currentRelation.userId === user.id ? currentRelation.friendId : currentRelation.userId;
                    const friend = friends.find(item => item.id === friendId);
                    const startIndex = chat.message.toLowerCase().indexOf(searchString.toLowerCase());
                    return (
                        <Box key={chat.id} onClick={() => router.push({ pathname : `/happy-chatting/chats/${friendId}` , query : { searchedChatId : chat.id } })} sx={{ px : "10px" , pt : "5px" , display : "flex" , flexDirection : "column" , gap : "5px" , cursor : "pointer" , ":hover" : { bgcolor : "#324352ff" } }} >
                            <Box sx={{ display : "flex" , gap : "10px"}}>
                                {friend ? <Box sx={{ width : "55px" , height : "55px" , display : "flex" , justifyContent : "center" , alignItems : "center" , borderRadius : "30px" , overflow : "hidden" }} >
                                    <Image alt="friend profile" src={friend.profileUrl ? friend.profileUrl : "/defaultProfile.jpg"} width={200} height={200} style={{ width : "55px" , height : "auto" , minHeight : "55px" }} />
                                </Box>
                                :<Box sx={{ bgcolor : "info.main" , display : "flex" , justifyContent : "center" , alignItems : "center" , height : "55px" , width : "55px" , borderRadius : "30px" }} >
                                    <BookmarkBorderRoundedIcon sx={{ fontSize : "35px" , color : "white"}} />
                                </Box>}
                                <Box>
                                    <Box>
                                        <Typography>{friend ? (friend.firstName + " " + friend.lastName) : "Saved Messages"}</Typography>
                                    </Box>
                                    <Box sx={{ display : "flex" , gap : "5px" , alignItems : "center"}}>
                                        {chat.imageMessageUrl ? 
                                        <Box sx={{ display : "flex" , justifyContent : "center" , alignItems : "center" , overflow : "hidden" , width : "30px" , height : "30px" , borderRadius : "5px"}}>
                                            <Image alt="message photo" src={chat.imageMessageUrl} width={200} height={200} style={{ width : "30px" , height : "auto"}} /> 
                                        </Box>
                                        :undefined}
                                        {chat.message ? 
                                        <Typography sx={{ overflow : "hidden" , maxWidth : "70vw" , textOverflow : "ellipsis" , whiteSpace : "nowrap" }}> 
                                            <Box component="span" sx={{ color : "GrayText"}} >{chat.voiceMessageUrl ? "🎤 " : ""}</Box>
                                            <Box component="span" sx={{ color : "GrayText"}} >{chat.message.slice(0 , startIndex )}</Box>
                                            <Box component="span" sx={{ color : "info.main"}} >{chat.message.slice( startIndex , startIndex + searchString.length )}</Box>
                                            <Box component="span" sx={{ color : "GrayText"}} >{chat.message.slice( startIndex + searchString.length)}</Box>
                                        </Typography>
                                        :<Typography sx={{ color : "info.main" , maxWidth : "65vw" , overflow : "hidden" , whiteSpace: 'nowrap', textOverflow : "ellipsis"}} >{chat.imageMessageUrl ? "Photo" : "Voice message"}</Typography>}
                                    </Box>
                                </Box>
                            </Box>
                            <Divider variant='middle' />
                        </Box>
                    )
                })
                :<Typography sx={{ flexGrow : 1 , textAlign : "center" , p : "20px" , fontSize : "23px" }}>No Result</Typography>}
            </Box>

        </Dialog>
    )
}

export default SearchForAll;