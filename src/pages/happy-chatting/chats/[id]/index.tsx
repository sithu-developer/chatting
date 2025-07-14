import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Box, IconButton, TextField, Typography } from "@mui/material";
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
import { MessageMenuType,  ConfirmationItemsType,  ForwardItemsType,  NewChat } from "@/types/chats";
import MessageMenu from "@/components/MessageMenu";
import ReplyOrEdit from "@/components/ReplyOrEdit";
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import Confirmation from "@/components/Confirmation";
import PinMessages from "@/components/PinMessages";
import PushPinRoundedIcon from '@mui/icons-material/PushPinRounded';
import ForwardMessage from "@/components/ForwardMessage";
import Profile from "@/components/Profile";
import { OpenSideBarComponent } from "@/types/sideBarComponent";
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import ShortcutOutlinedIcon from '@mui/icons-material/ShortcutOutlined';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { copyTexts } from "@/util/general";
import Image from "next/image";
import KeyboardReturnRoundedIcon from '@mui/icons-material/KeyboardReturnRounded';
import ChatMenu from "@/components/ChatMenu";
import SearchList from "@/components/SearchList";



const defaultNewChat : NewChat = {
    message : "" , friendId : 0 , userId : 0 , replyId : null , forwardFriendIds : [] , forwardChats : []
}

const ChattingPage = () => {
    const [ newChat , setNewChat ] = useState<NewChat>(defaultNewChat);
    const [ currentChats , setCurrentChats ] = useState<Chats[]>([]);
    const [ messageMenu , setMessageMenu ] = useState<MessageMenuType>( {chat : null , anchorEl : null });
    const [ replyChat , setReplyChat ] = useState<Chats | null>(null);
    const [ editedChat , setEditedChat ] = useState<Chats | null>(null);
    const [ confirmationItems , setConfirmationItems ] = useState<ConfirmationItemsType>( {open : false} );
    const [ pinChats , setPinChats ] = useState<Chats[]>([]);
    const [ forwardItems , setForwardItems ] = useState<ForwardItemsType>({ open : false });
    const friends = useAppSelector(store => store.userSlice.friends);
    const user = useAppSelector(store => store.userSlice.user);
    const chats = useAppSelector(store => store.chatsSlice.chats);
    const userIdAndFriendIds = useAppSelector(store => store.userIdAndFriendIdSlice.userIdAndFriendIds);
    const [ openFriendProfileComponent , setOpenFriendProfileComponent ] = useState<OpenSideBarComponent>({id : 1 , open : false});
    const [ selectedChats , setSelectedChats ] = useState<Chats[]>([]);
    const [ heightOfInput , setHeightOfInput ] = useState<number>(48);
    const [ chatMenuOpen , setChatMenuOpen ] = useState<boolean>(false);
    const [ searchListOpen , setSearchListOpen ]  = useState<boolean>(false);

    const router = useRouter();
    const query = router.query;
    const friendId = Number(query.id);
    const searchedChatId = Number(query.searchedChatId);
    const currentFriend = friends.find(item => item.id === friendId);
    const dispatch = useAppDispatch();
    const currentRelation = userIdAndFriendIds.find(item => item.userId === user?.id && item.friendId === friendId) as UserIdAndFriendId ;
    const userAndFriendRelationIdFromUser = currentRelation?.id as number;

    const lastRef = useRef< HTMLDivElement | null >(null);
    const inputRef = useRef<HTMLInputElement | null >(null);
    const messageRef = useRef<{ [ key : number ] : HTMLDivElement | null }>({});
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const hadRunOneTimeForSearchChat = useRef<boolean>(false);

    useEffect(() => {
        if(friendId && user && currentFriend ) {
            setNewChat({ ...newChat , friendId , userId : user.id });
            const currentUserAndFriendRelationIds = userIdAndFriendIds.filter(item => (item.userId === user.id && item.friendId === currentFriend.id) || (item.userId === currentFriend.id && item.friendId === user.id )).map(item => item.id);
            const currChats = chats.filter(item => currentUserAndFriendRelationIds.includes(item.userAndFriendRelationId));
            setCurrentChats(currChats);
            const pinChats = currChats.filter(chat => chat.isPin === true);
            setPinChats(pinChats);
        } else if(user && friendId && friendId === user.id) {
            setNewChat({ ...newChat , friendId , userId : user.id });
            const userAndFriendRelationIdForSavedChat = userIdAndFriendIds.find(item =>  item.userId === user.id && item.friendId === user.id);
            if(userAndFriendRelationIdForSavedChat) {
                const currChats = chats.filter(item => item.userAndFriendRelationId === userAndFriendRelationIdForSavedChat.id );
                setCurrentChats(currChats);
                const pinChats = currChats.filter(chat => chat.isPin === true);
                setPinChats(pinChats);
            }
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
        
    useEffect(() => {
        if( !hadRunOneTimeForSearchChat.current && searchedChatId && currentChats.length) {
            const searchedChat = messageRef.current[searchedChatId];
            if(searchedChat) {
                hadRunOneTimeForSearchChat.current = true;
                searchedChat.scrollIntoView({behavior : "instant" , block : "center"})
                searchedChat.style.backgroundColor = "rgba(206, 212, 224, 0.15)";
                setTimeout(() => {
                    searchedChat.style.backgroundColor = "";
                } , 1000)
            }
        }
    } , [searchedChatId && currentChats.length ])

    useEffect(() => {
        if(lastRef.current) {
            lastRef.current.scrollIntoView({ behavior : 'smooth'})
        }
    } , [heightOfInput])

    if(!user || !friendId || (!currentFriend && friendId !== user.id)) return null;

    const handleCreateChat = () => {
        const trimmedMessage = newChat.message.trim().replace(/^\n+|\n+$/g, '');
        if(trimmedMessage)
        dispatch(createChat({...newChat , message : trimmedMessage , isSuccess : () => {
            setNewChat(defaultNewChat);
            setReplyChat(null);
            setHeightOfInput(48);
        }}))
    }

    const handleUpdateChat = () => {
        if(editedChat) {
            const oldChat = currentChats.find(chat => chat.id === editedChat.id);
            editedChat.message = editedChat.message.trim().replace(/^\n+|\n+$/g, '');
            if(oldChat && editedChat.message !== oldChat.message ) {
                dispatch(updateChat({...editedChat , isSuccess : () => {
                    setEditedChat(null);
                }})) 
            } else {
                setEditedChat(null);
            }
        }
    }

    const handleMouseDown = ( exit : Chats | undefined , item : Chats) => {
        timerRef.current = setTimeout(() => {
            if(exit) {
                const chatsAfterRemove  = selectedChats.filter(selectedChat => selectedChat.id !== item.id);
                setSelectedChats(chatsAfterRemove);
            } else {
                setSelectedChats([...selectedChats , item ]);
            }
        } , 800)
    }

    const handleMouseUp = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    return (
        <Box sx={{ height : "100vh" , display : "flex" , flexDirection : "column" , justifyContent : "center" , alignItems : "center"}}>
            {selectedChats.length ? <Box sx={{ backgroundAttachment : "fixed", position : "fixed" , top : "0px" , width : "100vw" }}>
                <Box sx={{ bgcolor : "secondary.main" , p : "10px" , display : "flex" , alignItems : "center" , justifyContent : "space-between" }} >
                    <Box sx={{ display : "flex" , alignItems : "center" , gap : "10px"}}>
                        <IconButton onClick={() => setSelectedChats([])}>
                            <CloseRoundedIcon sx={{ color : "white"}} />
                        </IconButton>
                        <Typography sx={{ color : "white"}} >{selectedChats.length}</Typography>
                    </Box>
                    <Box sx={{ display : "flex" , gap : "10px"}}>
                        {selectedChats.length === 1 ? <IconButton onClick={() => {
                            setEditedChat(selectedChats[0])
                            setSelectedChats([])
                        }} >
                            <EditOutlinedIcon sx={{ color : "white"}} />
                        </IconButton>
                        :<span></span>}
                        <IconButton onClick={() => {
                            copyTexts({currentFriend , selectedChats , user , userIdAndFriendIds});
                            setSelectedChats([])
                        }} >
                            <ContentCopyRoundedIcon sx={{ transform : "scaleY(-1)" , color : "white" }} />
                        </IconButton>
                        <IconButton onClick={() => {
                            const sortedSelectedChats = selectedChats.sort((a,b) => a.id - b.id );
                            setForwardItems({ open : true , forwardChats : sortedSelectedChats})
                        }}>
                            <ShortcutOutlinedIcon sx={{  color : "white" }} />
                        </IconButton>
                        <IconButton onClick={() => {
                            setConfirmationItems({ open : true , chatsToDelete : selectedChats });
                        }} >
                            <DeleteOutlineRoundedIcon sx={{ color : "white" }} />
                        </IconButton>
                    </Box>
                </Box>
                {pinChats.length ? <PinMessages pinChats={pinChats} messageRef={messageRef} />
                : <span />}
                <Profile openSideBarComponent={openFriendProfileComponent} setOpenSideBarComponent={setOpenFriendProfileComponent} />
            </Box>
            :<Box sx={{ backgroundAttachment : "fixed", position : "fixed" , top : "0px" , width : "100vw" }}>
                <Box sx={{ bgcolor : "secondary.main" , p : "10px" , display : "flex" , alignItems : "center" , justifyContent : "space-between" }} >
                    <Box sx={{ display : "flex" , alignItems : "center" , gap : "10px" , flexGrow : 1 , cursor : (currentFriend ? "pointer" : "default") }} onClick={() => {
                        if(currentFriend) {
                            setOpenFriendProfileComponent({id : 1 , open : true , friendId : currentFriend.id })
                        }
                    }} >
                        <IconButton onClick={(e) =>{
                            e.stopPropagation();
                            router.push("/happy-chatting/chats");
                        }} >
                            <ArrowBackRoundedIcon sx={{ color : "white"}} />
                        </IconButton>
                        {currentFriend ? <Box sx={{ width : "45px" , height : "45px" , borderRadius : "30px" , overflow : "hidden" , display : "flex" , justifyContent : "center" , alignItems : "center" }} >
                            <Image alt="your friend profile" src={currentFriend.profileUrl ? currentFriend.profileUrl : "/defaultProfile.jpg"} width={300} height={300} style={{ width : "45px" , height : "auto"}} />
                        </Box>
                        :<Box sx={{ bgcolor : "info.main" , display : "flex" , justifyContent : "center" , alignItems : "center" , height : "45px" , width : "45px" , borderRadius : "30px" }} >
                            <BookmarkBorderRoundedIcon sx={{ fontSize : "30px" , color : "white"}} />
                        </Box>}
                        {currentFriend ? <Box >
                            <Typography sx={{ color : "white"}} >{currentFriend.firstName + " " + currentFriend.lastName }</Typography>
                            <Typography sx={{ color : (currentFriend.isOnline ? "info.main" : "GrayText" )}}  >{currentFriend.isOnline ? "online" : "offline"}</Typography>
                        </Box>
                        :<Typography  sx={{ color : "white"}}>Saved Messages</Typography>}
                    </Box>
                    <IconButton onClick={() => setChatMenuOpen(true)} >
                        <MoreVertRoundedIcon sx={{ color : "white"}} />
                    </IconButton>
                </Box>
                {pinChats.length ? <PinMessages pinChats={pinChats} messageRef={messageRef} />
                : <span />}
                <Profile openSideBarComponent={openFriendProfileComponent} setOpenSideBarComponent={setOpenFriendProfileComponent} />
            </Box>}
            <Box sx={{ display : "flex" , flexDirection : "column" , gap : "1px" , overflowY: 'auto', bgcolor : "primary.main" , height : "100vh" , width : "100vw" , pt :(pinChats.length ? "112px" : "72px") , pb : (replyChat || editedChat ? (heightOfInput < 160 ? heightOfInput : 160) + 49 + "px" : (heightOfInput < 160 ? heightOfInput : 160) + "px") }} >
                {currentChats.length ? currentChats.map(item => {
                    const createdTime = new Date(item.createdAt);
                    const updatedTime = new Date(item.updatedAt);
                    const userIdAndFriendIdOfChat = userIdAndFriendIds.find(element => element.id === item.userAndFriendRelationId) as UserIdAndFriendId;
                    const replyChat = chats.find(chat => chat.id === item.replyId);
                    const replyUserId = userIdAndFriendIds.find(userIdAndFriendId => replyChat && (userIdAndFriendId.id === replyChat.userAndFriendRelationId))?.userId;
                    const replyUser = (replyUserId === user.id) ? user : friends.find(friend => friend.id === replyUserId);
                    const forwardFriend = [...friends , user].find(friend => friend.id === item.forwardFriendId);

                    const exit = selectedChats.find(chat => chat.id === item.id)

                    if(userIdAndFriendIdOfChat)
                    return (
                    <Box key={item.id} sx={{ display : "flex" , alignItems : "center" ,  bgcolor : (exit ? "rgba(206, 212, 224, 0.15)" : "primary.main")}}  >
                        {selectedChats.length ? (!exit ? <Box sx={{ width : "28px" , height : "28px" , minHeight : "28px" , minWidth : "28px" , borderRadius : "20px" , border : "2px solid white" , mx : "10px" }} ></Box>
                        :<Box  sx={{ bgcolor : "white" , width : "28px" , height : "28px" , borderRadius : "20px" , display : "flex" , justifyContent : "center" , alignItems : "center", mx : "10px"  }}>
                            <CheckCircleRoundedIcon color="success" sx={{ fontSize : "31px"}} />
                        </Box>)
                        :<span></span>}
                        <Box ref={(el : HTMLDivElement | null) => { messageRef.current[item.id] = el}} 

                        sx={{ display : "flex" , justifyContent : (userIdAndFriendIdOfChat.userId === user.id) ? "flex-end" : "flex-start" , flexGrow : 1 , px : "5px" , py : "1.5px" , cursor : "pointer" }} 
                        
                        onClick={(event) => {
                            if(selectedChats.length) {
                                if(exit) {
                                    const chatsAfterRemove  = selectedChats.filter(selectedChat => selectedChat.id !== item.id);
                                    setSelectedChats(chatsAfterRemove);
                                } else {
                                    setSelectedChats([...selectedChats , item ]);
                                }
                            } else {
                                setMessageMenu({ chat : item , anchorEl : event.currentTarget})
                            }
                        }}

                        onContextMenu={(e) => e.preventDefault()}
                        onTouchStart={() =>  handleMouseDown( exit , item ) }
                        onMouseDown={() =>  handleMouseDown( exit , item )}
                        onTouchEnd={handleMouseUp}
                        onMouseUp={handleMouseUp}

                        >   
                            <Box sx={{  bgcolor : (userIdAndFriendIdOfChat.userId === user.id) ? "#5f1f9e" : "secondary.main" , borderRadius : (userIdAndFriendIdOfChat.userId === user.id) ? "10px 10px 0px 10px" : "10px 10px 10px 0px" , maxWidth : "85%" , p : "6px" }}>
                                {forwardFriend && <Box sx={{ mb : "2px" , color : (userIdAndFriendIdOfChat.userId === user.id) ? "text.primary" : "rgb(6, 188, 76)" }} onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenFriendProfileComponent({id : 1 , open : true , friendId : forwardFriend.id })
                                }}> 
                                    <Typography sx={{   lineHeight: 1 , fontSize : "14px" }}>Forwarded from</Typography>
                                    <Box sx={{ display : "flex" , alignItems : "center" , gap : "3px"}}>
                                        <Box sx={{ width : "25px" , height : "25px" , borderRadius : "15px" , overflow : "hidden" , display : "flex" , justifyContent : "center" , alignItems : "center" }}>
                                            <Image alt="profile photo" src={forwardFriend.profileUrl ? forwardFriend.profileUrl : "/defaultProfile.jpg"} width={200} height={200} style={{ width : "25px" , height : "auto"}} />
                                        </Box>
                                        <Typography sx={{  lineHeight: 1 , fontWeight : "bold" , fontSize : "15px" }}>{forwardFriend.firstName + " " + forwardFriend.lastName}</Typography>
                                    </Box>
                                </Box>}
                                <Box sx={{ display : "flex" , flexDirection : "column"  }}>
                                    {(replyChat && replyUser) && (
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
                                    <Box sx={{ display : "flex" , flexDirection : (item.message.includes("\n") ? "column" : "row") , justifyContent : "space-between" , alignItems : "center" , gap : "5px" , flexWrap : "wrap" , wordBreak : "break-word"  , flexGrow : 1 }}>
                                        <Typography sx={{ color : "text.primary" , flexGrow : 1 , whiteSpace : "pre-line" , mr : (item.message.includes("\n") ? "20px" : "0") }} >{item.message}</Typography>
                                        <Box sx={{ display : "flex" , justifyContent : "flex-end" , gap : "4px" , height : "11px" , width : (item.message.includes("\n") ? "100%" : "auto") , flexGrow : 1 }}>
                                            {item.isPin && <PushPinRoundedIcon sx={{ fontSize : "12px" , transform : "rotate(45deg)" , color : "text.secondary" , mt : "4px" }} />}
                                            <Typography sx={{ fontSize : "12px" ,  color : (userIdAndFriendIdOfChat.userId === user.id) ? "text.secondary" : "GrayText"}} >{(createdTime.getTime() === updatedTime.getTime() ? "" : "edited " ) + (createdTime.getHours() <= 12 ? (createdTime.getHours() === 0 ? 12 : createdTime.getHours()) :  (createdTime.getHours() - 12) ) + ":" + createdTime.getMinutes() + (createdTime.getHours() <= 12 ? " AM" : " PM" )}</Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                )})
                : <Box></Box>}
                <div ref={lastRef} />
                <MessageMenu messageMenu={messageMenu} setMessageMenu={setMessageMenu} setReplyChat={setReplyChat} setNewChat={setNewChat} newChat={newChat} setEditedChat={setEditedChat} setConfirmationItems={setConfirmationItems} setForwardItems={setForwardItems} />
                <Confirmation confirmationItems={confirmationItems} setConfirmationItems={setConfirmationItems} setSelectedChats={setSelectedChats}  />
                <ForwardMessage forwardItems={forwardItems} setForwardItems={setForwardItems} setSelectedChats={setSelectedChats} />
                <ChatMenu chatMenuOpen={chatMenuOpen} setChatMenuOpen={setChatMenuOpen} setConfirmationItems={setConfirmationItems} relationToDelete={currentRelation} setSearchListOpen={setSearchListOpen} />
                <SearchList searchListOpen={searchListOpen} setSearchListOpen={setSearchListOpen} currentFriend={currentFriend} messageRef={messageRef} />
            </Box>
            
            {selectedChats.length ? <Box sx={{ bgcolor : "secondary.main" ,  display : "flex" , justifyContent : "space-between" , alignItems : "center" , gap : "1px" ,  backgroundAttachment : "fixed"  , position : "fixed" , bottom : "0px" , width : "100vw" , px : "5px" , py : "3px" }}>
                {selectedChats.length === 1 ? <IconButton onClick={() => {
                    setReplyChat(selectedChats[0]);
                    setNewChat({...newChat , replyId : selectedChats[0].id });
                    setSelectedChats([]);
                }}>
                    <KeyboardReturnRoundedIcon sx={{ transform : "scaleY(-1)", color : "white" }} />
                    <Typography sx={{ color : "white" , ml : "5px"}} >Reply</Typography>
                </IconButton>
                : <span></span> }
                <IconButton onClick={() => {
                    const sortedSelectedChats = selectedChats.sort((a,b) => a.id - b.id );
                    setForwardItems({ open : true , forwardChats : sortedSelectedChats})
                }}>
                    <Typography sx={{ color : "white" }} >Forward</Typography>
                    <ShortcutOutlinedIcon sx={{ color : "white", ml : "5px" }} />
                </IconButton>
            </Box>
            :<Box sx={{ display : "flex" , flexDirection : "column" , gap : "1px" ,  backgroundAttachment : "fixed"  , position : "fixed" , bottom : "0px" , width : "100vw" }} >
                {replyChat && <ReplyOrEdit chat={replyChat} setChat={setReplyChat}  setNewChat={setNewChat} newChat={newChat} />}
                {editedChat && <ReplyOrEdit chat={editedChat} setChat={setEditedChat} />}
                <Box sx={{ bgcolor : "secondary.main" , display : "flex" , alignItems : "center" , justifyContent : "space-between" , gap : "5px" , py : "3px" }} >
                    <IconButton sx={{ alignSelf : "flex-end"}} >
                        <SentimentSatisfiedOutlinedIcon sx={{ color : "GrayText"}} />
                    </IconButton>
                    <TextField multiline variant="standard" color="secondary" ref={inputRef} sx={{ flexGrow : 1 , maxHeight : "150px" , overflowY : "auto" }} value={editedChat ? editedChat.message : newChat.message} autoFocus placeholder="Message" onChange={(event) => {
                        editedChat ? setEditedChat({...editedChat , message : event.target.value}) :  setNewChat({...newChat , message : event.target.value});
                        setHeightOfInput(event.target.scrollHeight === 23 ? 25+(event.target.scrollHeight) :  18+(event.target.scrollHeight))
                    }} />
                    {( newChat.message.trim().replace(/^\n+|\n+$/g, '') || editedChat?.message.trim().replace(/^\n+|\n+$/g, '') ) ? (editedChat?.message ? <IconButton onClick={handleUpdateChat} sx={{ bgcolor : "info.main" , width : "30px" , height : "30px" , mr : "5px" , mb : "5px" , alignSelf : "flex-end"}} > 
                        <DoneRoundedIcon sx={{color : "text.primary" }} />
                    </IconButton>
                    : <IconButton onClick={handleCreateChat} sx={{  alignSelf : "flex-end" }} > 
                        <SendRoundedIcon sx={{color : "info.main" }} />
                    </IconButton> )
                    :<Box sx={{ display : "flex" , alignSelf : "flex-end"}} >
                        <IconButton>
                            <AttachmentOutlinedIcon sx={{ transform : "rotate(135deg)" , color : "GrayText"}} />
                        </IconButton>
                        <IconButton>
                            <KeyboardVoiceOutlinedIcon sx={{ color : "GrayText"}} />
                        </IconButton>
                    </Box>}
                </Box>
            </Box>}
        </Box>
    )
}

export default ChattingPage;