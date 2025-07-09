import { Collapse, Box, Typography, IconButton } from '@mui/material';
import { TransitionGroup } from 'react-transition-group';
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { Chats, User, UserIdAndFriendId } from '@prisma/client';
import { NewChat } from '@/types/chats';
import { useAppSelector } from '@/store/hooks';
import { useEffect, useState } from 'react';

interface Props {
    setChat : (value : Chats | null) => void,
    chat : Chats
    setNewChat ?: (value : NewChat) => void;
    newChat ?: NewChat;
}

const ReplyOrEdit = ({ setChat , chat, setNewChat , newChat } : Props) => {
    const user = useAppSelector(store => store.userSlice.user);
    const friends = useAppSelector(store => store.userSlice.friends);
    const userIdAndFriendIds = useAppSelector(store => store.userIdAndFriendIdSlice.userIdAndFriendIds);
    const [ replyUser , setReplyUser ] = useState<User>()

    useEffect(() => {
        if(user && chat && newChat && userIdAndFriendIds.length && friends.length){
            const messageUserId = (userIdAndFriendIds.find(item => item.id === chat.userAndFriendRelationId) as UserIdAndFriendId).userId ;
            if(messageUserId === user.id) {
                setReplyUser(user);
            } else {
                const friend = friends.find(item => item.id === messageUserId);
                setReplyUser(friend)
            }

        }
    } , [user , chat , newChat , userIdAndFriendIds , friends])

    return (
            <TransitionGroup>
                <Collapse >
                    <Box sx={{ display : "flex" , bgcolor : "secondary.main" , justifyContent : "space-between" , alignItems : "center" , gap : "10px" , pl : "10px" }} >
                        {replyUser ? <ReplyRoundedIcon sx={{ color : "info.main" , fontSize : "35px"}} />
                        : <EditRoundedIcon sx={{ color : "info.main" , fontSize : "25px"}} />}
                        <Box sx={{ flexGrow : 1}}>
                            <Typography sx={{ color : "info.main" , fontWeight : "bold"}} >{replyUser ? "Reply to " + replyUser.firstName + " " + replyUser.lastName : "Edit Message"}</Typography>
                            <Typography sx={{ color : "GrayText" , maxWidth : "70vw" , textWrap : "nowrap" , overflow : "hidden" , textOverflow : "ellipsis"}} >{newChat ? chat.message : "Tap to add media"}</Typography>
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