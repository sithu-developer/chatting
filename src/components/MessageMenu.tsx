import { Box, Menu, MenuItem, Typography } from "@mui/material";
import KeyboardReturnRoundedIcon from '@mui/icons-material/KeyboardReturnRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import ShortcutOutlinedIcon from '@mui/icons-material/ShortcutOutlined';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { ChatMenuType, DeleteConfirmationItemsType, NewChat } from "@/types/chats";
import { Chats, User, UserIdAndFriendId } from "@prisma/client";
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import { useAppSelector } from "@/store/hooks";

interface Props {
    chatMenu : ChatMenuType
    setChatMenu : ( value : ChatMenuType ) => void;
    setReplyChat : (value : Chats | null) => void;
    setNewChat : (value : NewChat) => void;
    newChat : NewChat;
    setEditedChat : (value : Chats | null ) => void;
    setDeleteConfirmationItems : (value : DeleteConfirmationItemsType ) => void;
}

const MessageMenu = ({ chatMenu , setChatMenu , setReplyChat , setNewChat , newChat , setEditedChat , setDeleteConfirmationItems } : Props) => {
    const open = Boolean(chatMenu.anchorEl);
    const user = useAppSelector(store => store.userSlice.user) as User;
    const userIdAndFriendIds = useAppSelector(store => store.userIdAndFriendIdSlice.userIdAndFriendIds)
    
    if(chatMenu.chat === null ) return null;
    const createdTime = new Date(chatMenu.chat.createdAt);
    const updatedTime = new Date(chatMenu.chat.updatedAt);
    const isEdited = createdTime.getTime() !== updatedTime.getTime();
    const userIdAndFriendIdOfChat = userIdAndFriendIds.find(element => element.id === (chatMenu.chat as Chats).userAndFriendRelationId) as UserIdAndFriendId;

    
    
    return (
        <Menu
        anchorEl={chatMenu.anchorEl}
        open={open}
        onClose={() => setChatMenu({anchorEl : null , chat : null})}
        anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
        }}
        slotProps={{
            paper : {
                sx : {
                    backgroundColor : "secondary.main",
                    width : "180px"
                }
            },
            list : {
                disablePadding : true
            }
        }}
      > 
        {isEdited && <Box sx={{ display : "flex" , alignItems : "center" , p : "10px" , gap : "5px" , borderBottom : "8px solid rgb(15, 28, 40)" }}>
            <AccessTimeOutlinedIcon />
            <Typography sx={{ fontSize : "14px"}} >edited at {(updatedTime.getHours() <= 12 ? (updatedTime.getHours() === 0 ? 12 : updatedTime.getHours()) :  (updatedTime.getHours() - 12) ) + ":" + updatedTime.getMinutes() + (updatedTime.getHours() <= 12 ? " AM" : " PM" )}</Typography>
        </Box>}
        <MenuItem onClick={() => {
            setReplyChat(chatMenu.chat) 
            setChatMenu({anchorEl : null , chat : null});
            setNewChat({...newChat , replyId : (chatMenu.chat as Chats).id });
        }}>
           <KeyboardReturnRoundedIcon sx={{ transform : "scaleY(-1)" , mr : "15px" , color : "GrayText" }} />
           <Typography>Reply</Typography>
        </MenuItem>
        <MenuItem onClick={() => {
            navigator.clipboard.writeText((chatMenu.chat as Chats).message);
            setChatMenu({anchorEl : null , chat : null});
        }}  >
           <ContentCopyRoundedIcon sx={{ transform : "scaleY(-1)" , mr : "15px" , color : "GrayText" }} />
           <Typography>Copy</Typography>
        </MenuItem>
        <MenuItem >
           <ShortcutOutlinedIcon sx={{  mr : "15px" , color : "GrayText" }} />
           <Typography>Forward</Typography>
        </MenuItem>
        <MenuItem >
           <PushPinOutlinedIcon sx={{  mr : "15px" , transform : "rotate(45deg)" , color : "GrayText" }} />
           <Typography>Pin</Typography>
        </MenuItem>
        {(user.id === userIdAndFriendIdOfChat.userId) && <MenuItem onClick={() => {
            setChatMenu({anchorEl : null , chat : null});
            setEditedChat(chatMenu.chat as Chats)
        }}>
           <EditOutlinedIcon sx={{  mr : "15px" , color : "GrayText" }} />
           <Typography>Edit</Typography>
        </MenuItem>}
        <MenuItem onClick={() => {
            setChatMenu({anchorEl : null , chat : null});
            setDeleteConfirmationItems({ open : true , chatToDelete : (chatMenu.chat as Chats) });
        }} >
           <DeleteOutlineRoundedIcon sx={{  mr : "15px" , color : "GrayText" }} />
           <Typography>Delete</Typography>
        </MenuItem>
      </Menu>
    )
}

export default MessageMenu;