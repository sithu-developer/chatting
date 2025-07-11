import { useAppSelector } from '@/store/hooks';
import { FriendAndChatAndRelationType } from '@/types/user';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { Box, Dialog, IconButton, TextField, Typography } from "@mui/material";
import { Chats, User, UserIdAndFriendId } from '@prisma/client';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface Props {
    searchForAllOpen : boolean;
    setSearchForAllOpen : (value : boolean) => void;
}

const SearchForAll = ( { searchForAllOpen , setSearchForAllOpen } : Props ) => {
    const [ searchString , setSearchString ] = useState<string>("");
    const [ friendsAndChatsAndRelation , setFriendsAndChatsAndRelation] = useState<FriendAndChatAndRelationType[]>([]);
    const friends = useAppSelector(store => store.userSlice.friends);
    const user = useAppSelector(store => store.userSlice.user);
    const chats = useAppSelector(store => store.chatsSlice.chats);
    const userIdAndFriendIds = useAppSelector(store => store.userIdAndFriendIdSlice.userIdAndFriendIds);

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
            setFriendsAndChatsAndRelation(pinFristItems);
        
        }

    } , [friends , user , chats , userIdAndFriendIds])


    return (
        <Dialog fullScreen open={searchForAllOpen} >
            <Box sx={{ bgcolor : "secondary.main" , p : "10px" , py : "14px" , display : "flex" , alignItems : "center" , gap : "10px" }} >
                <IconButton onClick={() => {
                    setSearchForAllOpen(false);
                    setSearchString("");
                }} >
                    <ArrowBackRoundedIcon sx={{ color : "white"}} />
                </IconButton>
                <TextField autoFocus variant="standard" placeholder="Search" color="secondary" onChange={(event) => setSearchString(event.target.value.trim()) } />
            </Box>
            <Box sx={{ bgcolor : "secondary.dark" , width : "100vw" , p : "5px 10px"}}>
                <Typography sx={{ color : "GrayText" , fontWeight: "900"}}>Friends</Typography>
            </Box>
            <Box sx={{bgcolor : "secondary.main" , display : "flex" , gap : "20px" , p : "5px 10px" , width : "100vw" , overflowX : "auto" }}>
                {friendsAndChatsAndRelation.map(item => (
                    <Box sx={{ display : "flex" , flexDirection : "column" , alignItems : "center"}}>
                        <Box key={item.friend.id} sx={{ bgcolor : "info.main" , display : "flex" , justifyContent : "center" , alignItems : "center" , height : "55px" , width : "55px" , borderRadius : "30px" , overflow : "hidden" }} >
                            <Image alt="friend photo" src={item.friend.profileUrl ? item.friend.profileUrl : "/defaultProfile.jpg"} width={300} height={300} style={{ width : "55px" , height : "auto"}} />
                        </Box>
                        <Typography sx={{ fontSize : "13px" , maxWidth : "60px" , overflow : "hidden" , textOverflow : "ellipsis" , textWrap : "nowrap" }}>{item.friend.firstName + " " + item.friend.lastName}</Typography>
                    </Box>
                ))}
            </Box>

        </Dialog>
    )
}

export default SearchForAll;