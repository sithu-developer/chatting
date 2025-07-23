import { Collapse, Box, Typography, IconButton } from '@mui/material';
import { TransitionGroup } from 'react-transition-group';
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { Chats, User, UserIdAndFriendId } from '@prisma/client';
import { NewChat } from '@/types/chats';
import { useAppSelector } from '@/store/hooks';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import ChangeCircleRoundedIcon from '@mui/icons-material/ChangeCircleRounded';
import { VisuallyHiddenInput } from '@/util/general';

interface Props {
    setChat : (value : Chats | null) => void,
    chat : Chats
    setNewChat ?: (value : NewChat) => void;
    newChat ?: NewChat;
    setSelectedFile ?: (value : File | null) => void;
}

const ReplyOrEdit = ({ setChat , chat, setNewChat , newChat , setSelectedFile } : Props) => {
    const user = useAppSelector(store => store.userSlice.user);
    const friends = useAppSelector(store => store.userSlice.friends);
    const userIdAndFriendIds = useAppSelector(store => store.userIdAndFriendIdSlice.userIdAndFriendIds);
    const [ replyUser , setReplyUser ] = useState<User>()
    const voiceMessageRef = useRef<string>(chat.message ? chat.message : "Voice message");

    useEffect(() => {
        if(user && chat && newChat && userIdAndFriendIds.length && friends.length){
            const messageUserId = (userIdAndFriendIds.find(item => item.id === chat.userAndFriendRelationId) as UserIdAndFriendId).userId ;
            if(messageUserId === user.id) {
                setReplyUser(user);
            } else {
                const friend = friends.find(item => item.id === messageUserId);
                setReplyUser(friend);
            }

        }
    } , [user , chat , newChat , userIdAndFriendIds , friends])

    return (
            <TransitionGroup>
                <Collapse >
                    <Box sx={{ display : "flex" , bgcolor : "secondary.main" , justifyContent : "space-between" , alignItems : "center"  }} >
                        <Box component="label" role={undefined} sx={{ display : "flex" , gap : "10px" , alignItems : "center" , flexGrow : 1 , pl : "10px" , cursor : (replyUser || chat.voiceMessageUrl ? "default" : "pointer") , userSelect : "none"}}>
                            {!replyUser && !chat.voiceMessageUrl ? <VisuallyHiddenInput
                              type="file"
                              onChange={(event) => {
                                const file = event.target.files?.[0];
                                if(file && setSelectedFile) {
                                    setSelectedFile(file);
                                }
                                event.target.value = "";
                              }}
                            />
                            :undefined}
                            {replyUser ? <ReplyRoundedIcon sx={{ color : "info.main" , fontSize : "35px"}} />
                            : (chat.imageMessageUrl ? <ChangeCircleRoundedIcon sx={{ color : "info.main" , fontSize : "30px"}} />
                            :<EditRoundedIcon sx={{ color : "info.main" , fontSize : "25px"}} />)}
                            <Box sx={{ flexGrow : 1 , display : "flex" , alignItems : "center" , gap : "10px"}}>
                                {chat.imageMessageUrl ? 
                                <Box sx={{ display : "flex" , justifyContent : "center" , alignItems : "center" , overflow : "hidden" , width : "40px" , height : "40px" , borderRadius : "5px"}}>
                                    <Image alt="Message Image" src={chat.imageMessageUrl} width={200} height={200} style={{ width : "40px" , height : "auto" , borderRadius : "5px" , overflow : "hidden"}} />
                                </Box>
                                :undefined}
                                <Box>
                                    <Typography sx={{ color : "info.main" , fontWeight : "bold"}} >{replyUser ? "Reply to " + replyUser.firstName + " " + replyUser.lastName : (chat.imageMessageUrl ? "Replace Photo" : (chat.voiceMessageUrl ? "Edit Caption" : "Edit Message"))}</Typography>
                                    <Typography sx={{ color : "GrayText" , maxWidth : "70vw" , textWrap : "nowrap" , overflow : "hidden" , textOverflow : "ellipsis"}} >{newChat ? (chat.message ? chat.message : "Photo") : (chat.imageMessageUrl ? "Tap to change" : (chat.voiceMessageUrl ? voiceMessageRef.current : "Tap to add media"))}</Typography>
                                </Box>
                            </Box>
                        </Box>
                        <IconButton onClick={() => {
                            setChat(null);
                            if(setNewChat && newChat) {
                                setNewChat({...newChat , replyId : null });
                            }
                        }}>
                            <CloseRoundedIcon sx={{ color : "GrayText"}} />
                        </IconButton>
                    </Box>
                </Collapse>
            </TransitionGroup>
    )
}

export default ReplyOrEdit;