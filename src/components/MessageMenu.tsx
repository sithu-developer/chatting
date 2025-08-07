import { Box, Menu, MenuItem, Typography } from "@mui/material";
import KeyboardReturnRoundedIcon from '@mui/icons-material/KeyboardReturnRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import ShortcutOutlinedIcon from '@mui/icons-material/ShortcutOutlined';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { MessageMenuType, ConfirmationItemsType, ForwardItemsType, NewChat } from "@/types/chats";
import { Chats, User, UserIdAndFriendId } from "@prisma/client";
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateChat } from "@/store/slices/chatsSlice";
import { changeIsLoading, changeSnackBar } from "@/store/slices/generalSlice";
import { Severity } from "@/types/general";
import PhotoOutlinedIcon from '@mui/icons-material/PhotoOutlined';

interface Props {
    messageMenu : MessageMenuType
    setMessageMenu : ( value : MessageMenuType ) => void;
    setReplyChat : (value : Chats | null) => void;
    setNewChat : (value : NewChat) => void;
    newChat : NewChat;
    setEditedChat : (value : Chats | null ) => void;
    setConfirmationItems : (value : ConfirmationItemsType ) => void;
    setForwardItems : (value : ForwardItemsType) => void;
    setSelectedFile : (value : File | null) => void;
}

const MessageMenu = ({ messageMenu , setMessageMenu , setReplyChat , setNewChat , newChat , setEditedChat , setConfirmationItems , setForwardItems , setSelectedFile } : Props) => {
    const open = Boolean(messageMenu.anchorEl);
    const user = useAppSelector(store => store.userSlice.user) as User;
    const userIdAndFriendIds = useAppSelector(store => store.userIdAndFriendIdSlice.userIdAndFriendIds);
    const dispatch = useAppDispatch();
    
    if(messageMenu.chat === null ) return null;
    const createdTime = new Date(messageMenu.chat.createdAt);
    const updatedTime = new Date(messageMenu.chat.updatedAt);
    const isEdited = createdTime.getTime() !== updatedTime.getTime();
    const userIdAndFriendIdOfChat = userIdAndFriendIds.find(element => element.id === (messageMenu.chat as Chats).userAndFriendRelationId) as UserIdAndFriendId;

    const handleUnpin = () => {
        setMessageMenu({anchorEl : null , chat : null});
        dispatch(changeIsLoading(true))
        dispatch(updateChat({...messageMenu.chat as Chats , imageMessageUrl : undefined , isPin : false , isSuccess : () => {
            dispatch(changeSnackBar({isSnackBarOpen : true , message : "Message unpinned." , severity : Severity.success }))
            dispatch(changeIsLoading(false))
        } }))
    }

    const handleSaveToGallery = async (chat : Chats) => {
      try {
        if(!chat.imageMessageUrl) return null;
        const response = await fetch(chat.imageMessageUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `downloaded-photo-Happy-chatting-${chat.id}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch(err) {
        console.log("Image saving failed :" , err);
      }
    };
    
    return (
        <Menu
        anchorEl={messageMenu.anchorEl}
        open={open}
        onClose={() => setMessageMenu({anchorEl : null , chat : null})}
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
            setReplyChat(messageMenu.chat) 
            setMessageMenu({anchorEl : null , chat : null});
            setNewChat({...newChat , replyId : (messageMenu.chat as Chats).id });
            setEditedChat(null); // close edit chat if it is opened
        }}>
           <KeyboardReturnRoundedIcon sx={{ transform : "scaleY(-1)" , mr : "15px" , color : "GrayText" }} />
           <Typography>Reply</Typography>
        </MenuItem>
        {messageMenu.chat.message ? <MenuItem onClick={() => {
            navigator.clipboard.writeText((messageMenu.chat as Chats).message);
            setMessageMenu({anchorEl : null , chat : null});
        }}  >
           <ContentCopyRoundedIcon sx={{ transform : "scaleY(-1)" , mr : "15px" , color : "GrayText" }} />
           <Typography>Copy</Typography>
        </MenuItem>
        :undefined}
        {messageMenu.chat.imageMessageUrl ? <MenuItem onClick={async() => {
            if(messageMenu.chat && messageMenu.chat.imageMessageUrl) {
                dispatch(changeIsLoading(true))
                await handleSaveToGallery(messageMenu.chat)
                setMessageMenu({anchorEl : null , chat : null});
                dispatch(changeSnackBar({isSnackBarOpen : true , message : "Photo saved to Gallery" , severity : Severity.success}))
                dispatch(changeIsLoading(false))
            }
        }}  >
           <PhotoOutlinedIcon sx={{ mr : "15px" , color : "GrayText" }} />
           <Typography>Save to Gallery</Typography>
        </MenuItem>
        :undefined}
        <MenuItem onClick={() => {
            setMessageMenu({anchorEl : null , chat : null});
            setForwardItems({ open : true , forwardChats : [messageMenu.chat as Chats]});
        }}>
           <ShortcutOutlinedIcon sx={{  mr : "15px" , color : "GrayText" }} />
           <Typography>Forward</Typography>
        </MenuItem>
        {messageMenu.chat.isPin ? <MenuItem onClick={handleUnpin} >
            <Box sx={{ position : "relative" , mr : "15px" , display : "flex" , justifyContent : "center" , alignItems : "center"}}>
                <PushPinOutlinedIcon sx={{ transform : "rotate(45deg)" , color : "GrayText" }}  />
                <Box sx={{ position : "absolute" , mb : "4px" , ml : "4px" , bgcolor : "GrayText" , width : "1.5px" , height : "22px" ,  transform : "rotate(-45deg)" }} />
            </Box>
           <Typography>Unpin</Typography>
        </MenuItem>
        :<MenuItem onClick={() => {
            setMessageMenu({anchorEl : null , chat : null});
            setConfirmationItems({ open : true , chatToPin : (messageMenu.chat as Chats)})
        }} >
           <PushPinOutlinedIcon sx={{  mr : "15px" , transform : "rotate(45deg)" , color : "GrayText" }} />
           <Typography>Pin</Typography>
        </MenuItem>}
        {(user.id === userIdAndFriendIdOfChat.userId) && <MenuItem onClick={() => {
            setMessageMenu({anchorEl : null , chat : null});
            setEditedChat(messageMenu.chat as Chats);
            // close the selectedImage and reply chat , if there are opened
            setSelectedFile(null)
            setReplyChat(null)
            setNewChat({...newChat , replyId : null });
        }}>
           <EditOutlinedIcon sx={{  mr : "15px" , color : "GrayText" }} />
           <Typography>Edit</Typography>
        </MenuItem>}
        <MenuItem onClick={() => {
            setMessageMenu({anchorEl : null , chat : null});
            setConfirmationItems({ open : true , chatsToDelete : [(messageMenu.chat as Chats)] });            
        }} >
           <DeleteOutlineRoundedIcon sx={{  mr : "15px" , color : "GrayText" }} />
           <Typography>Delete</Typography>
        </MenuItem>
      </Menu>
    )
}

export default MessageMenu;