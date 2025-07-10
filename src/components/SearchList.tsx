import { Box, Dialog, Divider, IconButton, List, ListItemButton, TextField, Typography } from "@mui/material";
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { RefObject, useEffect, useState } from "react";
import { Chats, User, UserIdAndFriendId } from "@prisma/client";
import { useAppSelector } from "@/store/hooks";
import Image from "next/image";

interface Props {
    searchListOpen : boolean
    setSearchListOpen : (value : boolean) => void;
    currentFriend ?: User ;
    messageRef :  RefObject<{
        [key: number]: HTMLDivElement | null;
    }>
}

const SearchList = ( { searchListOpen , setSearchListOpen , currentFriend , messageRef } : Props) => {
    const [ searchValue , setSearchValue ] = useState<string>("")
    const [ searchChats , setSearchChats ] = useState<Chats[]>([]);
    const userIdAndFriendIds = useAppSelector(store => store.userIdAndFriendIdSlice.userIdAndFriendIds);
    const user = useAppSelector(store => store.userSlice.user);
    const friends = useAppSelector(store => store.userSlice.friends);
    const chats = useAppSelector(store => store.chatsSlice.chats);

    useEffect(() => {
        if( user && currentFriend && chats.length && userIdAndFriendIds.length ) {
            const currentUserAndFriendRelationIds = userIdAndFriendIds.filter(item => (item.userId === user.id && item.friendId === currentFriend.id) || (item.userId === currentFriend.id && item.friendId === user.id )).map(item => item.id);
            const currChats = chats.filter(item => currentUserAndFriendRelationIds.includes(item.userAndFriendRelationId));

            if(searchValue) {
                const filteredChats = currChats.filter(item => item.message.toLowerCase().includes(searchValue.toLowerCase()))
                setSearchChats(filteredChats);
            } else if(searchValue === "") {
                setSearchChats(currChats)
            }

        } else if(user && chats.length && userIdAndFriendIds.length) {
            const userAndFriendRelationIdForSavedChat = userIdAndFriendIds.find(item =>  item.userId === user.id && item.friendId === user.id);
            if(userAndFriendRelationIdForSavedChat) {
                const currChats = chats.filter(item => item.userAndFriendRelationId === userAndFriendRelationIdForSavedChat.id );
                
                if(searchValue) {
                    const filteredChats = currChats.filter(item => item.message.toLowerCase().includes(searchValue.toLowerCase()))
                    setSearchChats(filteredChats);
                } else if(searchValue === "") {
                    setSearchChats(currChats)
                }
            }
        }
    } , [ user , currentFriend , chats , userIdAndFriendIds , searchValue ]);
    
    if(!user) return null;
    return (
        <Dialog fullScreen open={searchListOpen}  >
            <Box sx={{ bgcolor : "secondary.main" , p : "10px" , py : "14px" , display : "flex" , alignItems : "center" , gap : "10px" }} >
                <IconButton onClick={() => {
                    setSearchListOpen(false);
                    setSearchValue("");
                }} >
                    <ArrowBackRoundedIcon sx={{ color : "white"}} />
                </IconButton>
                <TextField autoFocus variant="standard" placeholder="Search" color="secondary" onChange={(event) => setSearchValue(event.target.value.trim()) } />
            </Box>
            <List sx={{ bgcolor : "primary.main" , height : "calc(100vh - 69px)" , overflowY : "auto"}}>
                {searchChats.sort((a , b) => b.id - a.id).map(chat => {
                    const currentRelation = userIdAndFriendIds.find(item => item.id === chat.userAndFriendRelationId) as UserIdAndFriendId;
                    const friendOfMessage = friends.find(item => item.id === currentRelation.userId);
                    const createdTime = new Date(chat.createdAt);
                    const updatedTime = new Date(chat.updatedAt);
                return (
                    <Box key={chat.id}>
                      <ListItemButton onClick={() => {
                        setSearchListOpen(false);
                        setSearchValue("");
                        const messageBox = messageRef.current[chat.id];
                            if(messageBox) {
                                messageBox.scrollIntoView({behavior : "smooth" , block : "center"});
                                messageBox.style.backgroundColor= "rgba(206, 212, 224, 0.15)";
                                setTimeout(() => {
                                    messageBox.style.backgroundColor = "";
                                } , 2000)
                            }
                        }}
                       >
                        <Box sx={{ bgcolor : "info.main" , display : "flex" , justifyContent : "center" , alignItems : "center" , height : "55px" , width : "55px" , borderRadius : "30px" , overflow : "hidden" , mr : "15px" }} >
                            <Image alt="friend photo" src={friendOfMessage ? (friendOfMessage.profileUrl ? friendOfMessage.profileUrl : "/defaultProfile.jpg" ) : (user.profileUrl ? user.profileUrl : "/defaultProfile.jpg")} width={300} height={300} style={{ width : "55px" , height : "auto"}} />
                        </Box>
                        <Box sx={{ flexGrow : 1}}>
                            <Typography sx={{ fontWeight : "900"}} >{friendOfMessage ? (friendOfMessage.firstName + " " + friendOfMessage.lastName) : "You"}</Typography>
                            {searchValue ? <Box sx={{ display : "flex"}}>
                              <Typography sx={{ color : "GrayText", whiteSpace : "pre"}} >{chat.message.substring(0 , chat.message.toLowerCase().indexOf(searchValue.toLowerCase()))}</Typography>
                              <Typography color="info" sx={{ whiteSpace : "pre"}} >{chat.message.substring( chat.message.toLowerCase().indexOf(searchValue.toLowerCase()) ,chat.message.toLowerCase().indexOf(searchValue.toLowerCase()) + searchValue.length )}</Typography>
                              <Typography sx={{ color : "GrayText" , whiteSpace : "pre"}} >{chat.message.substring(chat.message.toLowerCase().indexOf(searchValue.toLowerCase()) + searchValue.length)}</Typography>
                            </Box>
                            :<Typography sx={{ color : "GrayText"}}>{chat.message}</Typography>}
                        </Box>
                        <Typography sx={{ fontSize : "12px" ,  color : "GrayText" }} >{(createdTime.getTime() === updatedTime.getTime() ? "" : "edited " ) + (createdTime.getHours() <= 12 ? (createdTime.getHours() === 0 ? 12 : createdTime.getHours()) :  (createdTime.getHours() - 12) ) + ":" + createdTime.getMinutes() + (createdTime.getHours() <= 12 ? " AM" : " PM" )}</Typography>
                      </ListItemButton>
                       <Divider variant="middle" />
                    </Box>
                )})}
            </List>
        </Dialog>
    )
}

export default SearchList;