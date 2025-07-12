import { Box, Divider, IconButton, Typography } from "@mui/material";
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded';
import PushPinRoundedIcon from '@mui/icons-material/PushPinRounded';
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Chats, User, UserIdAndFriendId } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import { FriendAndChatAndRelationType } from "@/types/user";
import { useRouter } from "next/router";
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import Image from "next/image";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { updateIsPinChats } from "@/store/slices/userIdAndFriendIdSlice";
import Confirmation from "@/components/Confirmation";
import { ConfirmationItemsType } from "@/types/chats";
import SearchForAll from "@/components/SearchForAll";
import SearchIcon from '@mui/icons-material/Search';



const ChatsPage = () => {
    const friends = useAppSelector(store => store.userSlice.friends);
    const user = useAppSelector(store => store.userSlice.user) as User;
    const chats = useAppSelector(store => store.chatsSlice.chats);
    const userIdAndFriendIds = useAppSelector(store => store.userIdAndFriendIdSlice.userIdAndFriendIds);
    const [ friendsAndChatsAndRelation , setFriendsAndChatsAndRelation] = useState<FriendAndChatAndRelationType[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [ selectedFriends , setSelectedFriends ] = useState<User[]>([]);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [ isAllSelectedChatsPin , setIsAllSelectedChatsPin  ] = useState<boolean>(false);
    const [ confirmationItems , setConfirmationItems ] = useState<ConfirmationItemsType>( {open : false} );
    const [ searchForAllOpen , setSearchForAllOpen ] = useState<boolean>(false);
    

    useEffect(() => {
        if(user && friends.length && chats.length && userIdAndFriendIds.length ) {
            const relationIdsOfFriendIds = userIdAndFriendIds.map(item => item.friendId);
            const relationIdsOfUserIds = userIdAndFriendIds.map(item => item.userId);
            const repeatedYourFriendIds = [...relationIdsOfFriendIds , ...relationIdsOfUserIds].filter(item => item !== user.id);
            
            const yourFriendIds = [...new Set(repeatedYourFriendIds) ];
            const yourFriends = friends.filter(item => yourFriendIds.includes(item.id));

            const lastChatsAndRelatedFriendsAndRelation : FriendAndChatAndRelationType[] = yourFriendIds.map(friendId => {
                const currentFriendRelationIds =  userIdAndFriendIds.filter(userIdAndFriendId =>( userIdAndFriendId.friendId === friendId || userIdAndFriendId.userId === friendId)).map(item => item.id)
                const currentFriendLastChat = chats.findLast(chat => currentFriendRelationIds.includes(chat.userAndFriendRelationId)) as Chats;
                const relatedFriend = yourFriends.find(friend => friend.id === friendId) as User;
                const userIdAndFriendId = userIdAndFriendIds.find(item => item.userId === user.id && item.friendId === relatedFriend.id) as UserIdAndFriendId ;
                return {friend : relatedFriend , chat : currentFriendLastChat , userIdAndFriendId };
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

    const handleMouseDown = ( exit : User | undefined , item : FriendAndChatAndRelationType) => {
        timerRef.current = setTimeout(() => {
            if(exit) {
                const friendsAfterRemove  = selectedFriends.filter(friend => friend.id !== item.friend.id);
                setSelectedFriends(friendsAfterRemove);
            } else {
                setSelectedFriends([...selectedFriends , item.friend ]);
            }
        } , 800)
    }

    useEffect(() => {
        if(selectedFriends.length) {
            const selectedFriendIds = selectedFriends.map(item => item.id);
            const selectedUserIdAndFriendIds = userIdAndFriendIds.filter(item => item.userId === user.id && selectedFriendIds.includes(item.friendId))
            const isAllSelectedChatsPin  = selectedUserIdAndFriendIds.every(item => item.isPinChat === true)
            setIsAllSelectedChatsPin(isAllSelectedChatsPin);
        } else {
            setIsAllSelectedChatsPin(false);
        }
    } , [selectedFriends])

    const handleMouseUp = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    const handlePinChats = () => {
        const selectedFriendIds = selectedFriends.map(item => item.id);
        const selectedUserIdAndFriendIds = userIdAndFriendIds.filter(item => item.userId === user.id && selectedFriendIds.includes(item.friendId))
        const selectedRelationIds = selectedUserIdAndFriendIds.map(item => item.id)
        dispatch(updateIsPinChats({ selectedRelationIds , allPinValue : !isAllSelectedChatsPin , isSuccess : () => {
            setSelectedFriends([]);
            setIsAllSelectedChatsPin(false);
        } }))
    }

    return (
        <Box sx={{ bgcolor : "primary.main" , height : "calc(100vh - 70px)" , position : "relative" }}>
            {selectedFriends.length ? <Box sx={{ bgcolor :  "secondary.main" , position : "absolute" , width : "100vw" , height : "60px" , top : "-60px" , display : "flex" , justifyContent : "space-between" , alignItems : "center" , px : "15px"}} >
                <Box sx={{ display : "flex" , alignItems : "center" , gap : "20px"}} >
                    <IconButton onClick={() => setSelectedFriends([])} >
                        <CloseRoundedIcon sx={{ color : "white"}} />
                    </IconButton>
                    <Typography sx={{ color : "white" }} >{selectedFriends.length}</Typography>
                </Box>
                <Box sx={{ display : "flex" , alignItems : "center" , gap : "10px"}} >
                    <IconButton onClick={handlePinChats} >
                        {isAllSelectedChatsPin ? <Box sx={{ position : "relative" , display : "flex" , justifyContent : "center" , alignItems : "center"}}>
                            <PushPinOutlinedIcon sx={{ transform : "rotate(45deg)" , color : "white" }}  />
                            <Box sx={{ position : "absolute" , mb : "4px" , ml : "4px" , bgcolor : "white" , width : "1.5px" , height : "22px" ,  transform : "rotate(-45deg)" }} />
                        </Box>
                        :<PushPinOutlinedIcon sx={{ transform : "rotate(45deg)" , color : "white" }} />}
                    </IconButton>
                    <IconButton onClick={() => {
                        const selectedFriendIds = selectedFriends.map(item => item.id);
                        const relationsToDelete = userIdAndFriendIds.filter(item => (item.userId === user.id && selectedFriendIds.includes(item.friendId)) || (selectedFriendIds.includes(item.userId) && item.friendId === user.id) )
                        setConfirmationItems({ open : true , relationsToDelete })
                    }} >
                        <DeleteOutlineRoundedIcon sx={{ color : "white" }} />
                    </IconButton>
                </Box>
            </Box>
            : <span></span> }
            {!selectedFriends.length ? <IconButton color="inherit" sx={{ position : "absolute" , top : "-52px" , right : "10px"}} onClick={() => setSearchForAllOpen(true)} >
                <SearchIcon sx={{ color : "white"}}  />
            </IconButton> : undefined}
            <Box sx={{ height : "calc(100vh - 70px)" , overflowY : "auto"}}>
                {friendsAndChatsAndRelation.map(item => {
                    const createdTime = new Date(item.chat.createdAt);
                    const exit = selectedFriends.find(friend => friend.id === item.friend.id );

                    return (
                        <Box key={item.friend.id}

                        onContextMenu={(e) => {
                            e.preventDefault();
                            if(!exit) {
                                setSelectedFriends([...selectedFriends , item.friend ]);
                            }
                        }} 

                        onClick={() => {
                            if(selectedFriends.length) {
                                if(exit) {
                                    const friendsAfterRemove  = selectedFriends.filter(friend => friend.id !== item.friend.id);
                                    setSelectedFriends(friendsAfterRemove);
                                } else {
                                    setSelectedFriends([...selectedFriends , item.friend ]);
                                }
                            } else {
                                router.push(`./chats/${item.friend.id}`)
                            }
                        }}

                        onTouchStart={() => { handleMouseDown( exit , item ) }}
                        onMouseDown={() => { handleMouseDown( exit , item ) }}
                        onTouchEnd={handleMouseUp} 
                        onMouseUp={handleMouseUp}

                        sx={{ height : "80px" , display : "flex" , alignItems : "center" , p : "5px" , px : "10px" ,  gap : "10px" , ":hover" : { bgcolor : "#3b4044" }}} 
                        >
                            <Box sx={{ position : "relative"}}>
                                {item.friend.id !== user.id ? <Box sx={{ bgcolor : "info.main" , display : "flex" , justifyContent : "center" , alignItems : "center" , height : "55px" , width : "55px" , borderRadius : "30px" , overflow : "hidden" }} >
                                    <Image alt="friend photo" src={item.friend.profileUrl ? item.friend.profileUrl : "/defaultProfile.jpg"} width={300} height={300} style={{ width : "55px" , height : "auto"}} />
                                </Box>
                                :<Box sx={{ bgcolor : "info.main" , display : "flex" , justifyContent : "center" , alignItems : "center" , height : "55px" , width : "55px" , borderRadius : "30px" }} >
                                    <BookmarkBorderRoundedIcon sx={{ fontSize : "35px" , color : "white"}} />
                                </Box>}
                                {exit && <Box  sx={{ position : "absolute" , bottom : "1px" , right : "1px" , bgcolor : "white" , width : "15px" , height : "15px" , borderRadius : "15px" , display : "flex" , justifyContent : "center" , alignItems : "center" }}>
                                    <CheckCircleRoundedIcon color="success" />
                                </Box>}
                            </Box>
                            <Box sx={{ display : "flex" , flexDirection : "column" , flexGrow : 1 , gap : "15px" , userSelect : "none" }} >
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
                    )
                })}
            </Box>
            <Confirmation confirmationItems={confirmationItems} setConfirmationItems={setConfirmationItems} setSelectedFriends={setSelectedFriends} />
            <SearchForAll searchForAllOpen={searchForAllOpen} setSearchForAllOpen={setSearchForAllOpen} />
        </Box>
    )
}

export default ChatsPage;