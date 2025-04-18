import { Collapse, Box, Typography, IconButton } from '@mui/material';
import { TransitionGroup } from 'react-transition-group';
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { Chats, User } from '@prisma/client';
import { NewChat } from '@/types/chats';

interface Props {
    setChat : (value : Chats | null) => void,
    chat : Chats
    currentFriend ?: User;
    setNewChat ?: (value : NewChat) => void;
    newChat ?: NewChat;
}

const ReplyOrEdit = ({ setChat , chat , currentFriend , setNewChat , newChat } : Props) => {
    return (
            <TransitionGroup>
                <Collapse >
                    <Box sx={{ display : "flex" , bgcolor : "secondary.main" , justifyContent : "space-between" , alignItems : "center" , gap : "10px" , pl : "10px" }} >
                        {newChat ? <ReplyRoundedIcon sx={{ color : "info.main" , fontSize : "35px"}} />
                        : <EditRoundedIcon sx={{ color : "info.main" , fontSize : "25px"}} />}
                        <Box sx={{ flexGrow : 1}}>
                            <Typography sx={{ color : "info.main" , fontWeight : "bold"}} >{currentFriend ? "Reply to " + currentFriend.firstName + " " + currentFriend.lastName : "Edit Message"}</Typography>
                            <Typography sx={{ color : "GrayText" , maxWidth : "70vw" , textWrap : "nowrap" , overflow : "hidden" , textOverflow : "ellipsis"}} >{newChat ? chat.message : "Tap to add media"}</Typography>
                        </Box>
                        <IconButton onClick={() => {
                            setChat(null);
                            (setNewChat && newChat) && setNewChat({...newChat , replyId : null });
                        }}>
                            <CloseRoundedIcon sx={{ color : "GrayText"}} />
                        </IconButton>
                    </Box>
                </Collapse>
            </TransitionGroup>
    )
}

export default ReplyOrEdit;